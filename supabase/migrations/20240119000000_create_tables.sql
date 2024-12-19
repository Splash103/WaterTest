-- Create rooms table
create table if not exists rooms (
    id text primary key,
    host text not null,
    player_count integer not null default 1,
    max_players integer not null default 4,
    created_at timestamp with time zone not null default now(),
    settings jsonb not null default '{}'::jsonb,
    players jsonb not null default '[]'::jsonb
);

-- Create online_players table
create table if not exists online_players (
    id text primary key,
    name text not null,
    avatar jsonb not null,
    status text not null check (status in ('online', 'in_game', 'idle')),
    last_seen timestamp with time zone not null default now(),
    created_at timestamp with time zone not null default now()
);

-- Create index for faster queries on last_seen
create index if not exists online_players_last_seen_idx on online_players(last_seen);

-- Create cleanup function for inactive players
create or replace function cleanup_inactive_players() returns trigger as $$
begin
    delete from online_players
    where last_seen < now() - interval '2 minutes';
    return new;
end;
$$ language plpgsql;

-- Drop trigger if exists
drop trigger if exists cleanup_inactive_players_trigger on online_players;

-- Create trigger for cleanup
create trigger cleanup_inactive_players_trigger
    after insert on online_players
    execute function cleanup_inactive_players();

-- Enable RLS but with public access
alter table rooms enable row level security;
alter table online_players enable row level security;

-- Allow public read/write access to rooms
create policy "Public access to rooms"
    on rooms for all
    using (true)
    with check (true);

-- Allow public read/write access to online_players
create policy "Public access to online_players"
    on online_players for all
    using (true)
    with check (true);