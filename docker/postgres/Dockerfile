FROM postgres:12.3
COPY init.sql /docker-entrypoint-initdb.d/init.sql
# Adjust PostgreSQL configuration so that remote connections to the
# database are possible.
RUN echo "host all  all    0.0.0.0/0  password" >> /var/lib/postgresql/data/pg_hba.conf
# And add ``listen_addresses`` to ``/var/lib/postgresql/data/postgresql.conf``
RUN echo "listen_addresses='*'" >> /var/lib/postgresql/data/postgresql.conf
