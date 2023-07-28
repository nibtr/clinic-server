## Guidelines to get started

1. Connect to SQL Server

- Open SQL Server Configuration Manager
- Locate `SQL Server Network Configuration` and expand it
- Click on `Protocols for MSSQLSERVER`
- Right-click on `TCP/IP` and select `Enable` (if it is not already enabled)
- Click on the `properties` of `TCP/IP` and select the `IP Addresses` tab
- Scroll down to `IPAll` and set the `TCP Port` to `1433` (or any other port you want to use)

2. .env file

- Create a `.env` file in the root directory of the project
- Copy the contents of `.env.example` into `.env`
- Change the values of the variables in `.env` to match your SQL Server configuration
- Default value for `DB_PORT` is `1433`
- The script we used to create the database with the name `DentalClinicDev` is in `database.sql` file of the `dental-clinic-database` repo. You can use it to create the database and tables.

3. Pull the db

- After you have created the database, you can pull the db to use with prisma, run `npx prisma db pull` in the root directory of the project
- Then run `npx prisma generate` to generate the prisma client

4. Run the server