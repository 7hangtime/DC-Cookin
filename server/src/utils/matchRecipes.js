// Since we used a dataset from kaggle for recipes, instead of editing each entry, this function
// will normalize both our ingredients, and the recipes.json ingredients to catch matches where 
// they're worded or spaced differently
function norm(s) {
    let t = String(s || "").toLowerCase().trim().replace(/\s+/g, " ");

    if (t.endsWith("ies") && t.length > 4) {
        t = t.slice(0, -3) + "y";   // berries -> berry
    } else if (t.endsWith("s") && !t.endsWith("ss") && t.length > 3) {
        t = t.slice(0, -1);         // apples -> apple
    }

    return t;
}

// get matches
export function matchRecipes(recipes, pantryNames, { maxMissing = 2, preferences = {} } = {}) {
    const pantrySet = new Set((pantryNames || []).map(norm).filter(Boolean));
    // console.log("pantry:", pantrySet)
    console.log("pref:", preferences)
    const avoidedIngs =
        Object.entries(preferences)
            .filter(([_, pref]) => String(pref) === "-1")
            .map(([name]) => norm(name))
            .filter(Boolean);
  
    console.log("Ingredients avoided list:", avoidedIngs)

    const exactMatches = [];
    const partialMatches = [];

    for (const recipe of recipes) {
        const recipeIngs = (recipe.ingredients || []).map(norm).filter(Boolean);
        if (recipeIngs.length === 0) continue;


        const blocked = recipeIngs.some(ing => 
            avoidedIngs.some(avoided => norm(ing).includes(avoided))
        );
        if (blocked) continue;

        const missing = [];
        let have = 0;

        for (const ing of recipeIngs) {
            if (pantrySet.has(ing)) have++;
            else missing.push(ing);
        }

        const matchPct = Math.round((have / recipeIngs.length) * 100);

        if (missing.length === 0) {
            exactMatches.push(recipe);
        } else if (missing.length <= maxMissing && have > 0) {
            partialMatches.push({ recipe, missing, matchPct });
        }
    }

    partialMatches.sort((a, b) => (b.matchPct - a.matchPct) || (a.missing.length - b.missing.length));
    return { exactMatches, partialMatches };
}