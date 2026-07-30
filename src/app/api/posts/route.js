import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import dbConnect from "@/lib/db";
import Post from "@/models/Post";

const SEED_POSTS = [
  {
    title: "Neon Rain Noir",
    category: "Cinematic",
    date: "24 Jul 2026",
    author: "Studio",
    image: "https://picsum.photos/seed/neonrainnoir/900/650",
    blurb: "A moody, high-contrast street scene built for anyone chasing that rain-on-neon film look. Works well as a portrait background or a standalone poster.",
    prompt: "A lone figure in a trench coat crossing a rain-slicked street at night, neon signage reflected in the puddles in magenta and cyan, heavy atmospheric fog, shot on 35mm anamorphic lens, high contrast noir lighting, cinematic color grade, shallow depth of field, dramatic rim light."
  },
  {
    title: "Sunset Diner Postcard",
    category: "Retro Print",
    date: "22 Jul 2026",
    author: "Studio",
    image: "https://picsum.photos/seed/sunsetdiner/900/650",
    blurb: "Warm, halftone-print nostalgia. This one prints beautifully on merch, zines, or as a standalone travel-style poster.",
    prompt: "Vintage travel postcard illustration of a roadside diner at golden hour, chrome details catching the light, palm trees in silhouette, warm halftone print texture, retro 1970s color palette of tangerine and teal, bold serif signage, slightly worn paper grain."
  },
  {
    title: "Marble Bloom",
    category: "Minimal",
    date: "19 Jul 2026",
    author: "Studio",
    image: "https://picsum.photos/seed/marblebloom/900/650",
    blurb: "Clean, editorial, and calm. A go-to prompt whenever a design brief calls for restraint over spectacle.",
    prompt: "A single flower stem carved from white marble resting on a pale sand-colored plinth, soft studio lighting from the top left, minimal negative space, subtle long shadow, editorial product photography style, muted neutral palette."
  },
  {
    title: "Glitch Saint",
    category: "Surreal",
    date: "16 Jul 2026",
    author: "Studio",
    image: "https://picsum.photos/seed/glitchsaint/900/650",
    blurb: "Old-master portraiture collides with digital noise. A strong pick for album art or anything that wants to feel a little unsettled.",
    prompt: "Renaissance-style oil portrait of a saint with a halo made of scan lines and RGB chromatic aberration, gold leaf background fracturing into pixel noise, baroque drapery, oil painting texture colliding with digital glitch artifacts."
  },
  {
    title: "Analog Grain Portrait",
    category: "Cinematic",
    date: "14 Jul 2026",
    author: "Studio",
    image: "https://picsum.photos/seed/analoggrain/900/650",
    blurb: "Soft, warm, and a little imperfect — built to look like it came off a roll of expired film rather than a render.",
    prompt: "Close up portrait lit by a single warm tungsten bulb, visible film grain, slight halation around highlights, shot on expired Kodak Portra 400, soft focus falloff at the edges, candid unposed expression, muted amber tone."
  },
  {
    title: "Midnight Botanica",
    category: "Surreal",
    date: "11 Jul 2026",
    author: "Studio",
    image: "https://picsum.photos/seed/midnightbotanica/900/650",
    blurb: "Macro-scale, glowing, and quiet. A favorite for anything that needs a dreamy, oversized nature moment.",
    prompt: "Oversized bioluminescent jungle leaves glowing faint teal against a pitch black background, tiny fireflies drifting between the veins of the leaves, moody macro photography, dew droplets catching pinpoint light, dreamlike scale."
  },
  {
    title: "Chrome Serenade",
    category: "Typography",
    date: "08 Jul 2026",
    author: "Studio",
    image: "https://picsum.photos/seed/chromeserenade/900/650",
    blurb: "Liquid, reflective type that reads as a finished poster on its own — no extra layout needed.",
    prompt: "Bold liquid chrome 3D typography spelling a short word, reflecting a sunset gradient of orange and violet, studio floor reflection beneath the letters, dramatic specular highlights, render style similar to Cinema 4D with Octane."
  },
  {
    title: "Paper Cut Skyline",
    category: "Minimal",
    date: "05 Jul 2026",
    author: "Studio",
    image: "https://picsum.photos/seed/papercutskyline/900/650",
    blurb: "Tactile, layered, and warm. Reads like a handmade craft piece rather than a digital render.",
    prompt: "Layered paper-cut illustration of a city skyline at dusk, each building a different shade of indigo paper casting a soft drop shadow onto the layer behind it, warm orange paper sun low on the horizon, tactile craft aesthetic."
  }
];

function todayLabel() {
  return new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export async function GET() {
  try {
    await dbConnect();
    let posts = await Post.find({}).sort({ createdAt: -1 });

    if (posts.length === 0) {
      console.log("No posts found. Seeding database...");
      await Post.insertMany(SEED_POSTS);
      posts = await Post.find({}).sort({ createdAt: -1 });
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    
    const { title, category, image, prompt, blurb, author, content } = data;

    if (!title || !category || !image || !prompt) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const post = await Post.create({
      title,
      category,
      image,
      prompt,
      blurb: blurb || "A ready-to-use AI prompt for this poster.",
      author: author || "Studio",
      date: todayLabel(),
      content: content || "",
    });

    revalidateTag("posts"); // Bust cached posts list
    return NextResponse.json(post, { status: 211 }); // using 201 Created or custom response
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
