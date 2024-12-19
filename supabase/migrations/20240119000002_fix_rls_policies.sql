-- Drop existing policies
drop policy if exists "Public access to rooms" on rooms;
drop policy if exists "Public access to online_players" on online_players;
drop policy if exists "Allow read access to rooms" on rooms;
drop policy if exists "Allow insert to rooms" on rooms;
drop policy if exists "Allow update to rooms" on rooms;

-- Create more permissive policies for rooms
create policy "Enable read access for all users" on rooms
    for select using (true);

create policy "Enable insert access for all users" on rooms
    for insert with check (true);

create policy "Enable update access for all users" on rooms
    for update using (true);

create policy "Enable delete access for all users" on rooms
    for delete using (true);

-- Create more permissive policies for online_players
create policy "Enable read access for all users" on online_players
    for select using (true);

create policy "Enable insert access for all users" on online_players
    for insert with check (true);

create policy "Enable update access for all users" on online_players
    for update using (true);

create policy "Enable delete access for all users" on online_players
    for delete using (true);