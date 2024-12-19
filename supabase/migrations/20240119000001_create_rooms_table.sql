-- Drop existing rooms table if it exists
drop table if exists rooms;

-- Create rooms table with proper structure
create table rooms (
    id text primary key,
    host text not null,
    player_count integer not null default 1,
    max_players integer not null default 4,
    settings jsonb not null default '{}'::jsonb,
    players jsonb not null default '[]'::jsonb,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Create index for faster queries
create index rooms_created_at_idx on rooms(created_at);

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create trigger for updating updated_at
create trigger update_rooms_updated_at
    before update on rooms
    for each row
    execute function update_updated_at_column();

-- Create cleanup function for old rooms
create or replace function cleanup_old_rooms() returns trigger as $$
begin
    delete from rooms
    where created_at < now() - interval '1 day';
    return new;
end;
$$ language plpgsql;

-- Create trigger for cleanup
create trigger cleanup_old_rooms_trigger
    after insert on rooms
    execute function cleanup_old_rooms();

-- Enable RLS
alter table rooms enable row level security;

-- Create policies
create policy "Allow read access to rooms"
    on rooms for select
    to authenticated, anon
    using (true);

create policy "Allow insert to rooms"
    on rooms for insert
    to authenticated, anon
    with check (true);

create policy "Allow update to rooms"
    on rooms for update
    to authenticated, anon
    using (true)
    with check (true);