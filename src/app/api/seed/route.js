import db from "@/db";

const pages = [
  {
    title: "First note",
    contents: "This is the first note content.",
  },
  {
    title: "Second note",
    contents: "This is the second note content.",
  },
  {
    title: "Third note",
    contents: "This is the third note content.",
  }
];

export async function GET(request) {
  //   return Response.json(musics);
  try {
    await db.Note.deleteMany();
    for (const page of pages) {
      const result = await db.Note.create({ data: page });
      console.log(result);
    }
    return new Response("Seeded");
  } catch (e) {
    return new Response(e, { status: 500 });
  }
}
