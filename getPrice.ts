const fs = require("fs/promises");
const plants = [
  { name: "Black Lotus", id: 13468, rarity: "epic" },
  { name: "Icecap", id: 13467, rarity: "uncommon" },
  { name: "Plaguebloom", id: 13466, rarity: "uncommon" },
  { name: "Mountain Silversage", id: 13465, rarity: "uncommon" },
  { name: "Dreamfoil", id: 13463, rarity: "uncommon" },
  { name: "Gromsblood", id: 8846, rarity: "uncommon" },
  { name: "Ghost Mushroom", id: 8845, rarity: "uncommon" },
  { name: "Firebloom", id: 4625, rarity: "uncommon" },
  { name: "Crystal Vial", id: 8925, rarity: "common" },
];

async function fetchPlantData() {
  const siteId = "uT0Wc_Uhbe5mhpGkk6ziK";
  const baseUrl = `https://www.wowauctions.net/_next/data/${siteId}/auctionHouse/turtle-wow/ambershire/mergedAh`;

  const results = await Promise.all(
    plants.map(async (plant) => {
      // Format name for URL: lowercase and replace spaces with hyphens
      const formattedName = plant.name.toLowerCase().replace(/\s+/g, "-");
      const url = `${baseUrl}/${formattedName}-${plant.id}.json?realmAh=turtle-wow&realmAh=ambershire&realmAh=mergedAh&realmAh=${formattedName}-${plant.id}`;

      try {
        const response = await fetch(url);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        return {
          name: plant.name,
          id: plant.id,
          data: data.pageProps.item.stats, // Usually the relevant data is inside pageProps in Next.js JSON files
        };
      } catch (error) {
        console.error(`Could not fetch data for ${plant.name}:`, error.message);
        return { name: plant.name, error: error.message };
      }
    }),
  );

  console.log("Fetch Complete:", results);
  save(results);
}

async function save(results) {
  try {
    // Convert the object to a string with 2-space indentation for readability
    const jsonData = JSON.stringify(results, null, 2);

    await fs.writeFile("plants_data.json", jsonData, "utf8");
    console.log("Successfully saved data to plants_data.json");
  } catch (error) {
    console.error("Error writing to file:", error);
  }
}

fetchPlantData();
