-- Drop all existing policies
drop policy if exists "Enable read access for all users" on rooms;
drop policy if exists "Enable insert access for all users" on rooms;
drop policy if exists "Enable update access for all users" on rooms;
drop policy if exists "Enable delete access for all users" on rooms;
drop policy if exists "Enable read access for all users" on online_players;
drop policy if exists "Enable insert access for all users" on online_players;
drop policy if exists "Enable update access for all users" on online_players;
drop policy if exists "Enable delete access for all users" on online_players;

-- Create unrestricted policies for rooms
create policy "Unrestricted access to rooms"
    on rooms
    for all
    using (true)
    with check (true);

-- Create unrestricted policies for online_players
create policy "Unrestricted access to online_players"
    on online_players
    for all
    using (true)
    with check (true);

-- Grant all privileges to anon and authenticated roles
grant all privileges on rooms to anon, authenticated;
grant all privileges on online_players to anon, authenticated;