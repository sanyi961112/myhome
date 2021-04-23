CREATE TABLE IF NOT EXISTS public.users{
	id integer serial,
	username character varying PRIMARY KEY NOT NULL,
	email character varying NOT NULL,
	password varchar(64) NOT NULL
}
TABLESPACE pg_default;

CREATE TABLE IF NOT EXISTS public.linklist{
	id integer FOREIGN KEY NOT NULL,
	links varchar[]; 
}
TABLESPACE pg_default;

ALTER TABLE public.users
    OWNER to postgres;
	
ALTER TABLE public.linklist
    OWNER to postgres;
	
INSERT INTO users VALUES
    ('100000', 'admin', 'admin@myhome.com', 'admin');