export const DashboardAdmin = [
  { name: "Website Info", path: "/admin/company" },
  {
    group: "Gestion des Produits",
    items: [
      { name: "Brands", path: "/admin/brand" },
      { name: "Categories", path: "/admin/category" },
      { name: "Products", path: "/admin/product" },
      { name: "Promotion", path: "/admin/promotion" },
      { name: "Reviews", path: "/admin/review" },
    ],
  },

  {
    group: "Manage Users",
    items: [
      { name: "Users", path: "/admin/users" },
      { name: "Role", path: "/admin/users/role" },
    ],
  },
  {
    group: "Commandes et Revenue",
    items: [
      { name: "Orders", path: "/admin/order" },
      { name: "Invoice", path: "/admin/invoice" },
      { name: "Revenue", path: "/admin/revenue" },
      { name: "Entreprise", path: "/admin/companies" },
    ],
  },

  {
    group: "Blog",
    items: [
      { name: "All Post", path: "/admin/blog" },
      { name: "P Category", path: "/admin/blog/post-category" },
      { name: "P Comments", path: "/admin/blog/comments" },
    ],
  },
];
