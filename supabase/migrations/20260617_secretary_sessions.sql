create table if not exists secretary_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  session_id text,
  session_type text not null check (session_type in ('open', 'close')),
  analysis jsonb,
  created_at timestamptz default now()
);

alter table secretary_sessions enable row level security;

create policy "Users see own sessions"
  on secretary_sessions for select
  using (auth.uid() = user_id);

create policy "Users insert own sessions"
  on secretary_sessions for insert
  with check (auth.uid() = user_id);
