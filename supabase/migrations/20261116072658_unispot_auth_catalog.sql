-- Keep legacy text IDs and URLs intact while moving durable storage to Postgres.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '' check (length(name) <= 100),
  role text not null default 'Student' check (role in ('Student', 'Community')),
  campus text not null default '' check (length(campus) <= 100),
  bio text not null default '' check (length(bio) <= 200),
  created_at timestamptz not null default now()
);
create table public.organizations (
  id text primary key,
  owner_id uuid references auth.users(id) on delete set null,
  data jsonb not null check (jsonb_typeof(data) = 'object' and data->>'id' = id)
);
create index organizations_owner_idx on public.organizations(owner_id);
create table public.hubs (
  id text primary key,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  organization_id text not null unique references public.organizations(id),
  owner_id uuid references auth.users(id) on delete set null,
  data jsonb not null check (jsonb_typeof(data) = 'object' and data->>'id' = id and data->>'slug' = slug),
  created_at timestamptz not null default now()
);
create index hubs_owner_idx on public.hubs(owner_id);
create table public.opportunities (
  id text primary key,
  hub_id text references public.hubs(id),
  organization_id text not null references public.organizations(id),
  status text not null check (status in ('draft','published')),
  updated_at timestamptz not null default now(),
  data jsonb not null check (jsonb_typeof(data) = 'object' and data->>'id' = id)
);
create index opportunities_hub_idx on public.opportunities(hub_id);
create index opportunities_organization_idx on public.opportunities(organization_id);
create index opportunities_published_idx on public.opportunities(updated_at desc) where status = 'published';
create table public.saved_opportunities (
  user_id uuid not null references auth.users(id) on delete cascade,
  opportunity_id text not null references public.opportunities(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, opportunity_id)
);
create index saved_opportunity_idx on public.saved_opportunities(opportunity_id);
create table public.hub_follows (
  user_id uuid not null references auth.users(id) on delete cascade,
  hub_id text not null references public.hubs(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, hub_id)
);
create index hub_follows_hub_idx on public.hub_follows(hub_id);

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.hubs enable row level security;
alter table public.opportunities enable row level security;
alter table public.saved_opportunities enable row level security;
alter table public.hub_follows enable row level security;

grant usage on schema public to anon, authenticated, service_role;
grant select on public.organizations, public.hubs, public.opportunities to anon, authenticated;
grant insert, update on public.organizations, public.hubs, public.opportunities to authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, delete on public.saved_opportunities, public.hub_follows to authenticated;
grant all on public.profiles, public.organizations, public.hubs, public.opportunities, public.saved_opportunities, public.hub_follows to service_role;

create policy profiles_read on public.profiles for select to authenticated using (id = (select auth.uid()));
create policy profiles_create on public.profiles for insert to authenticated with check (id = (select auth.uid()));
create policy profiles_update on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy organizations_read on public.organizations for select to anon, authenticated using (true);
create policy organizations_create on public.organizations for insert to authenticated with check (owner_id = (select auth.uid()));
create policy organizations_update on public.organizations for update to authenticated using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
create policy hubs_read on public.hubs for select to anon, authenticated using (true);
create policy hubs_create on public.hubs for insert to authenticated with check (
  owner_id = (select auth.uid()) and exists (select 1 from public.organizations o where o.id = organization_id and o.owner_id = (select auth.uid()))
);
create policy hubs_update on public.hubs for update to authenticated using (owner_id = (select auth.uid())) with check (
  owner_id = (select auth.uid()) and exists (select 1 from public.organizations o where o.id = organization_id and o.owner_id = (select auth.uid()))
);
create policy opportunities_read on public.opportunities for select to anon, authenticated using (
  status = 'published' or hub_id in (select id from public.hubs where owner_id = (select auth.uid()))
);
create policy opportunities_create on public.opportunities for insert to authenticated with check (
  exists (select 1 from public.hubs h where h.id = hub_id and h.organization_id = opportunities.organization_id and h.owner_id = (select auth.uid()))
);
create policy opportunities_update on public.opportunities for update to authenticated using (
  hub_id in (select id from public.hubs where owner_id = (select auth.uid()))
) with check (
  exists (select 1 from public.hubs h where h.id = hub_id and h.organization_id = opportunities.organization_id and h.owner_id = (select auth.uid()))
);
create policy saved_read on public.saved_opportunities for select to authenticated using (user_id = (select auth.uid()));
create policy saved_create on public.saved_opportunities for insert to authenticated with check (
  user_id = (select auth.uid()) and exists (select 1 from public.opportunities o where o.id = opportunity_id and o.status = 'published')
);
create policy saved_delete on public.saved_opportunities for delete to authenticated using (user_id = (select auth.uid()));
create policy follows_read on public.hub_follows for select to authenticated using (user_id = (select auth.uid()));
create policy follows_create on public.hub_follows for insert to authenticated with check (user_id = (select auth.uid()));
create policy follows_delete on public.hub_follows for delete to authenticated using (user_id = (select auth.uid()));

-- Atomic creation. SECURITY INVOKER deliberately keeps all RLS checks in effect.
create function public.create_unispot_hub(p_id text, p_slug text, p_organization jsonb, p_data jsonb)
returns void language plpgsql security invoker set search_path = '' as $$
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  insert into public.organizations(id, owner_id, data) values (p_id, auth.uid(), p_organization);
  insert into public.hubs(id, slug, organization_id, owner_id, data) values (p_id, p_slug, p_id, auth.uid(), p_data);
end;
$$;
revoke all on function public.create_unispot_hub(text, text, jsonb, jsonb) from public, anon;
grant execute on function public.create_unispot_hub(text, text, jsonb, jsonb) to authenticated;
