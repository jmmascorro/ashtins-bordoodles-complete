const sequelize = require('./config/database');
const Puppy = require('./models/Puppy');
const Parent = require('./models/Parent');
const fs = require('fs');
const path = require('path');

// Paths to JSON data in the sibling frontend project
const frontendDataPath = path.join(__dirname, '..', 'bordoodles-site', 'src', 'data');

async function seed() {
    try {
        await sequelize.sync({ force: true }); // Reset DB
        console.log('Database reset.');

        // Read Puppies
        // Read Puppies
        const puppiesRaw = fs.readFileSync(path.join(frontendDataPath, 'puppies.json'), 'utf8');
        const puppiesData = JSON.parse(puppiesRaw).map(p => ({
            ...p,
            // Create multi-image array by default. Logic: use the main image + the new assets we added
            images: [p.image, "/puppy2.png", "/puppy3.png"]
        }));

        // Read Parents
        const parentsRaw = fs.readFileSync(path.join(frontendDataPath, 'parents.json'), 'utf8');
        const parentsData = JSON.parse(parentsRaw);

        // Insert Data
        await Puppy.bulkCreate(puppiesData);
        console.log(`Seeded ${puppiesData.length} puppies.`);

        await Parent.bulkCreate(parentsData);
        console.log(`Seeded ${parentsData.length} parents.`);

        console.log('Seeding complete.');
    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        await sequelize.close();
    }
}

seed();
