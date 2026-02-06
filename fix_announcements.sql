-- Add link_text column to announcements table
alter table public.announcements 
add column if not exists link_text text;

-- Comment on column
comment on column public.announcements.link_text is 'Text for the button inside the modal that opens the link';
