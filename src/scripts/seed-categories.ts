// TODO: add a script to seed categories in the database

import { db } from "@/db";
import { categories } from "@/db/schema";

const categoryNames = [
  "Cars and Vehicles",
  "Comedy",
  "Education",
  "Gaming",
  "Entertainment",
  "Film and animation",
  "Music",
  "How-to and style",
  "News and politics",
  "Nonprofits",
  "People and blogs",
  "Religion",
  "Science",
  "Sports",
  "Technology",
  "Travel",
];

async function main() {
  console.log("seeding categories...");
  try {
    const values = categoryNames.map((name) => ({
      name,
      description: `videos related to ${name.toLowerCase()}`,
    }));
    await db.insert(categories).values(values);
    console.log("seeded categories successfully!!");
  } catch (error) {
    console.error("error seeding categories  ", error);
    process.exit(1);
  }
}
main();
