import express from "express";
import bodyParser from "body-parser";
import pg from "pg"

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "040721",
  port: 5432
})
db.connect();
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));



async function checkList() {
  const result = await db.query("SELECT * FROM items")
  let items = [];
  result.rows.forEach((item) => {
    items.push({ id: item.id, title: item.title })
  })
  return items
}

app.get("/", async (req, res) => {
  const items = await checkList();
  console.log(items);
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  await db.query("INSERT INTO items (title) VALUES ($1)",
    [item]
  );
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const editId = req.body.updatedItemId;
  const editText = req.body.updatedItemTitle;
  await db.query("UPDATE items SET title =$1 WHERE id=$2",
    [editText ,editId ]
  )
  res.redirect("/")
});

app.post("/delete", async (req, res) => {
  const deleteItemId = req.body.deleteItemId;
  console.log(deleteItemId);
  await db.query("DELETE FROM items WHERE id=$1",
    [deleteItemId]
  )
  res.redirect("/")
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
