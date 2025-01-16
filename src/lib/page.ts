export enum Page {
  Users = "Users",
  Brands = "Brands",
  Categories = "Categories",
  Products = "Products",
  Promotion = "Promotion",
  Reviews = "Reviews",
  Orders = "Orders",
  Invoice = "Invoice",
  Revenue = "Revenue",
  Blog = "Blog",
  BlogComments = "BlogComments",
  PostCategory = "PostCategory",
  Company = "Company",
  Role = "Role",
  Entreprise="Entreprise",
}

// Define the main structure with nested groups
export const pages = {
  "Website Info": [{ name: Page.Company, path: "/admin/company" }],
  "Gestion Stocks": [
    { name: Page.Brands, path: "/admin/brand" },
    { name: Page.Categories, path: "/admin/category" },
    { name: Page.Products, path: "/admin/product" },
    { name: Page.Promotion, path: "/admin/promotion" },
  ],
  "Manage Users": [
    { name: Page.Users, path: "/admin/users" },
    { name: Page.Role, path: "/admin/users/role" },
  ],

  "Clients Feedbacks": [{ name: Page.Reviews, path: "/admin/review" }],
  "Lists Orders": [
    { name: Page.Orders, path: "/admin/order" },
    { name: Page.Invoice, path: "/admin/invoice" },
    { name: Page.Revenue, path: "/admin/revenue" },
  ],
  Blog: [
    { name: Page.Blog, path: "/admin/blog" },
    { name: Page.BlogComments, path: "/admin/bloglike" },
    { name: Page.PostCategory, path: "/admin/postcategory" },
  ],
  "Entreprise": [
    { name: Page.Entreprise, path: '/admin/companies' }
  ],
};
  