create table note (
  created_at timestamp(6) with time zone not null,
  updated_at timestamp(6) with time zone not null,
  id uuid not null,
  owner_id uuid not null,
  content varchar(255) not null,
  title varchar(255) not null,
  primary key (id)
);
create table note_image (
  created_at timestamp(6) with time zone not null,
  updated_at timestamp(6) with time zone not null,
  id uuid not null,
  note_id uuid not null,
  alt_text varchar(255),
  content_type varchar(255) not null,
  blob bytea not null,
  primary key (id)
);
create table user_image (
  created_at timestamp(6) with time zone not null,
  updated_at timestamp(6) with time zone not null,
  id uuid not null,
  user_id uuid not null unique,
  alt_text varchar(255),
  content_type varchar(255) not null,
  blob bytea not null,
  primary key (id)
);
create table users (
  created_at timestamp(6) with time zone not null,
  updated_at timestamp(6) with time zone not null,
  id uuid not null,
  email varchar(255) not null unique,
  name varchar(255),
  username varchar(255) not null unique,
  primary key (id)
);
alter table
  if exists note
add
  constraint FKtiwc1e1gmadi3tihkemcdo2ek foreign key (owner_id) references users;
alter table
  if exists note_image
add
  constraint FKa6395acr0iamj4tkat0ps85ec foreign key (note_id) references note;
alter table
  if exists user_image
add
  constraint FKo80y1v1f5vsfflp3jlax0x1c6 foreign key (user_id) references users;
