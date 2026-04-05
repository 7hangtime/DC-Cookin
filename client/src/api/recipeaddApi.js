import fs from "fs";

export async function addRecipe() {

    app.post('/api/recipes', (req, res) => {
        const recipe = {
            id: req.body.recipename.trim().toLowerCase().replace(/\s+/g, '-'),
            name: req.body.recipename,  
            ingredients: req.body.ingredients.split(','),
            ingredients_with_measurements: req.body.measurements.split(','),
            directions: req.body.instructions.split(','),
            image_url: req.body.image
        };

        const recipes = fs.readFileSync('server/src/data/recipes.json');
        const json = JSON.parse(recipes);
        json.push(...recipe);

        fs.writeFileSync('server/src/data/recipes.json', JSON.stringify(json, null, 2));

        res.json({success: true});
    });
}