-- OB Club site + admin. All tables prefixed obc_ so they can share a database.
-- RLS is enabled with no policies: the app connects as the table owner (bypasses
-- RLS), while any public REST layer (e.g. Supabase anon key) sees nothing.

create table if not exists obc_content (
  kind       text        not null,
  id         text        not null,
  data       jsonb       not null,
  sort       integer     not null default 0,
  published  boolean     not null default true,
  updated_at timestamptz not null default now(),
  primary key (kind, id)
);

create table if not exists obc_leads (
  id           bigserial   primary key,
  kind         text        not null,            -- contact | subscribe
  name         text,
  email        text        not null,
  intent       text,
  topic        text,
  message      text,
  consent      boolean     not null default false,
  consent_text text,
  page         text,
  status       text        not null default 'new', -- new | contacted | done
  notes        text,
  created_at   timestamptz not null default now()
);
create index if not exists obc_leads_created_idx on obc_leads (created_at desc);

create table if not exists obc_pageviews (
  id         bigserial   primary key,
  path       text        not null,
  referrer   text,
  device     text,
  visitor    text,
  created_at timestamptz not null default now()
);
create index if not exists obc_pageviews_created_idx on obc_pageviews (created_at desc);

create table if not exists obc_media (
  id         text        primary key,
  mime       text        not null,
  bytes      bytea       not null,
  created_at timestamptz not null default now()
);

alter table obc_content   enable row level security;
alter table obc_leads     enable row level security;
alter table obc_pageviews enable row level security;
alter table obc_media     enable row level security;
