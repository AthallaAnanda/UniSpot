-- Run against an isolated local database after bootstrap-local.sql + migration.
-- Fixtures roll back; no Auth accounts are created in the hosted project.
begin;
insert into auth.users(id) values ('00000000-0000-0000-0000-000000000001'), ('00000000-0000-0000-0000-000000000002');
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000001', true);
select public.create_unispot_hub('test-hub', 'test-hub', '{"id":"test-hub"}', '{"id":"test-hub","slug":"test-hub"}');
insert into public.profiles(id, name) values (auth.uid(), 'Owner A');
insert into public.opportunities(id, hub_id, organization_id, status, data) values
  ('test-draft', 'test-hub', 'test-hub', 'draft', '{"id":"test-draft"}'),
  ('test-public', 'test-hub', 'test-hub', 'published', '{"id":"test-public"}');
insert into public.saved_opportunities(user_id, opportunity_id) values (auth.uid(), 'test-public');
insert into public.hub_follows(user_id, hub_id) values (auth.uid(), 'test-hub');
do $$ begin
  if (select count(*) from public.opportunities) <> 2 then raise exception 'Owner must see draft'; end if;
end $$;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-000000000002', true);
do $$ begin
  if (select count(*) from public.opportunities) <> 1 then raise exception 'Cross-account draft leak'; end if;
  if exists(select 1 from public.profiles) or exists(select 1 from public.saved_opportunities) or exists(select 1 from public.hub_follows) then raise exception 'Personal data leak'; end if;
  update public.opportunities set status = 'published' where id = 'test-draft';
  if found then raise exception 'Cross-account draft update'; end if;
  update public.hubs set owner_id = auth.uid() where id = 'test-hub';
  if found then raise exception 'Cross-account Hub takeover'; end if;
  begin
    insert into public.opportunities(id, hub_id, organization_id, status, data) values ('attack', 'test-hub', 'test-hub', 'published', '{"id":"attack"}');
    raise exception 'Cross-account publishing accepted';
  exception when insufficient_privilege then null; end;
  begin
    insert into public.saved_opportunities(user_id, opportunity_id) values ('00000000-0000-0000-0000-000000000001', 'test-public');
    raise exception 'Cross-account bookmark accepted';
  exception when insufficient_privilege then null; end;
end $$;
set local role anon;
select set_config('request.jwt.claim.sub', '', true);
do $$ begin
  if (select count(*) from public.opportunities) <> 1 then raise exception 'Anonymous draft leak'; end if;
  begin
    perform public.create_unispot_hub('attack', 'attack', '{"id":"attack"}', '{"id":"attack","slug":"attack"}');
    raise exception 'Anonymous publishing accepted';
  exception when insufficient_privilege then null; end;
end $$;
rollback;
