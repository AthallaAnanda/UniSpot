-- Ensure the one-time hosted transfer bridge cannot be called again.
drop function if exists public.import_unispot_catalog_once(text);
