// @ts-nocheck
import { createPool } from '@vercel/postgres';
import { sql } from '@vercel/postgres';

async function seed() {
	const createTable = await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      image VARCHAR(255),
      "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    `;

	console.log(`Created "users" table`);

	try {
		// Create the gemstone_reports table
		const createGemstoneReportsTable = await sql`
    CREATE TABLE IF NOT EXISTS gemstone_reports (
      report_id INT PRIMARY KEY,
      report_number VARCHAR(255),
      report_date DATE,
      report_title VARCHAR(255),
      laboratory_name VARCHAR(255),
      award_number INT,
      qr_code VARCHAR(255),
      signature TEXT,
      barcode VARCHAR(255),
      report_verification_url VARCHAR(255)
    );
  `;
		console.log(`Created "gemstone_reports" table`);
	} catch (error) {
		console.log(error);
	}
	// Create the gemstone_details table
	try {
		const createGemstoneDetailsTable = await sql`
    CREATE TABLE IF NOT EXISTS gemstone_details (
      gemstone_id INT PRIMARY KEY,
      report_id INT REFERENCES gemstone_reports(report_id),
      description VARCHAR(255),
      identification VARCHAR(255),
      origin VARCHAR(255),
      weight DECIMAL(10, 2),
      length DECIMAL(10, 2),
      width DECIMAL(10, 2),
      height DECIMAL(10, 2),
      cut VARCHAR(255),
      shape VARCHAR(255),
      color VARCHAR(255),
      additional_color VARCHAR(255),
      comments TEXT
    );
  `;
		console.log(`Created "gemstone_details" table`);
	} catch (error) {
		console.log(error);
	}
	const users = await Promise.all([
		sql`INSERT INTO gemstone_reports (report_id, report_number, report_date, report_title, laboratory_name, award_number, qr_code, signature, barcode, report_verification_url)
    VALUES
    (1, 'GRS2022-129599', '2022-12-08', 'Gemstone Report', 'GRS (Gemresearch Swisslab)', 3936, '12345qr', 'Signature1', 'Barcode1', 'http://example.com/verify/1'),
    (2, 'GRS2022-089741', '2022-08-17', 'Examination Results', 'GRS (Gemresearch Swisslab)', 3937, '12346qr', 'Signature2', 'Barcode2', 'http://example.com/verify/2');
    `,
		sql`INSERT INTO gemstone_details (gemstone_id, report_id, description, identification, origin, weight, length, width, height, cut, shape, color, additional_color, comments)
    VALUES
    (1, 1, 'One magnificent gemstone', 'Natural Yellow Sapphire', 'Sri Lanka', 130.61, 40.80, 26.94, 16.19, 'Modified brilliant/step', 'Pear', 'Vivid yellow', 'Golden', 'No indication of thermal treatment'),
    (2, 2, 'One polished gemstone', 'Natural Sapphire', 'Sri Lanka', 151.66, 34.53, 26.11, 16.65, 'Cabochon', 'Oval', 'Blue', NULL, 'No indication of thermal treatment');
    `,
		sql`
          INSERT INTO users (name, email, image)
          VALUES ('Guillermo Rauch', 'rauchg@vercel.com', 'https://images.ctfassets.net/e5382hct74si/2P1iOve0LZJRZWUzfXpi9r/9d4d27765764fb1ad7379d7cbe5f1043/ucxb4lHy_400x400.jpg')
          ON CONFLICT (email) DO NOTHING;
      `,
		sql`
          INSERT INTO users (name, email, image)
          VALUES ('Lee Robinson', 'lee@vercel.com', 'https://images.ctfassets.net/e5382hct74si/4BtM41PDNrx4z1ml643tdc/7aa88bdde8b5b7809174ea5b764c80fa/adWRdqQ6_400x400.jpg')
          ON CONFLICT (email) DO NOTHING;
      `,
		sql`
          INSERT INTO users (name, email, image)
          VALUES ('Steven Tey', 'stey@vercel.com', 'https://images.ctfassets.net/e5382hct74si/4QEuVLNyZUg5X6X4cW4pVH/eb7cd219e21b29ae976277871cd5ca4b/profile.jpg')
          ON CONFLICT (email) DO NOTHING;
      `
	]);
	console.log(`Seeded ${users.length} users`);

	return {
		createTable,
		users,
		createGemstoneReportsTable,
		createGemstoneDetailsTable
	};
}

export async function load() {
	const db = createPool();
	const startTime = Date.now();

	try {
		const { rows: users } = await db.query('SELECT * FROM users');
		const duration = Date.now() - startTime;
		return {
			users: users,
			duration: duration
		};
	} catch (error) {
		if (error?.message === `relation "users" does not exist`) {
			console.log('Table does not exist, creating and seeding it with dummy data now...');
			// Table is not created yet
			await seed();
			const { rows: users } = await db.query('SELECT * FROM users');
			const duration = Date.now() - startTime;
			return {
				users: users,
				duration: duration
			};
		} else {
			throw error;
		}
	}
}
