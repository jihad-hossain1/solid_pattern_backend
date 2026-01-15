import {
  mysqlTable,
  int,
  varchar,
  text,
  json,
  timestamp,
  boolean,
  decimal,
  uniqueIndex,
  index,
  bigint,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const logs = mysqlTable(
  "logs",
  {
    id: int("id").primaryKey().autoincrement(),
    logType: varchar("logType", { length: 50 }).notNull(),
    message: text("message").notNull(),
    details: text("details"),
    context: json("context"),
    source: varchar("source", { length: 100 }),
    metadata: json("metadata"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    index("log_type_idx").on(table.logType),
    index("created_at_idx").on(table.createdAt),
  ]
);

export const temp = mysqlTable("temp", {
  id: int("id").primaryKey().autoincrement(),
  jsonData: json("jsonData"),
  code: varchar("code", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  type: varchar("type", { length: 50 }).default("email_verify").notNull(),
});

export const business = mysqlTable("business", {
  id: int("id").primaryKey().autoincrement(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  mobile: varchar("mobile", { length: 20 }),
  isActive: boolean("isActive").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  isStockManaged: boolean("isStockManaged").default(false).notNull(),
  business_balanceId: int("business_balanceId"),
});

export const users = mysqlTable(
  "users",
  {
    id: int("id").primaryKey().autoincrement(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    username: varchar("username", { length: 100 }).notNull(),
    password: text("password").notNull(),
    mobile: varchar("mobile", { length: 20 }),
    firstName: varchar("firstName", { length: 100 }),
    lastName: varchar("lastName", { length: 100 }),
    isActive: boolean("isActive").default(false).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    businessId: int("businessId")
      .notNull()
      .references(() => business.id),
  },
  (table) => [
    index("idx_is_users_business_id").on(table.businessId),
    index("idx_is_users_first_name_last_name").on(
      table.firstName,
      table.lastName
    ),
  ]
);

export const businessConfig = mysqlTable("business_config", {
  id: int("id").primaryKey().autoincrement(),
  businessId: int("businessId")
    .unique()
    .notNull()
    .references(() => business.id),
  bankAccount: varchar("bankAccount", { length: 191 })
    .default("inactive")
    .notNull(),
  invoiceLogo: varchar("invoiceLogo", { length: 191 })
    .default("active")
    .notNull(),
  watermark: varchar("watermark", { length: 191 })
    .default("inactive")
    .notNull(),
  signature: varchar("signature", { length: 191 })
    .default("inactive")
    .notNull(),
  isStockManaged: varchar("isStockManaged", { length: 191 })
    .default("active")
    .notNull(),
  isBalanceBasedManagement: varchar("isBalanceBasedManagement", { length: 191 })
    .default("inactive")
    .notNull(),
  currency: varchar("currency", { length: 10 }).default("usd").notNull(),
  actionLog: varchar("actionLog", { length: 20 }).default("inactive").notNull(),
});

export const businessProfile = mysqlTable("business_profile", {
  id: int("id").primaryKey().autoincrement(),
  address: text("address"),
  avatar: varchar("avatar", { length: 256 }),
  organization: varchar("organization", { length: 50 }),
  contactNumber: varchar("contactNumber", { length: 20 }),
  contactEmail: varchar("contactEmail", { length: 100 }),
  website: varchar("website", { length: 150 }),
  country: varchar("country", { length: 50 }),
  state: varchar("state", { length: 50 }),
  city: varchar("city", { length: 50 }),
  about: varchar("about", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  businessId: int("businessId")
    .unique()
    .notNull()
    .references(() => business.id),
});

export const businessActionLog = mysqlTable(
  "business_action_log",
  {
    id: int("id").primaryKey().autoincrement(),
    businessId: int("businessId")
      .notNull()
      .references(() => business.id),
    actionId: varchar("actionId", { length: 50 }).notNull(),
    actionType: varchar("actionType", { length: 50 })
      .default("invoice")
      .notNull(),
    actionTitle: varchar("actionTitle", { length: 255 }).notNull(),
    userId: int("userId")
      .notNull()
      .references(() => users.id),
    ipAddress: varchar("ipAddress", { length: 45 }),
    userAgent: varchar("userAgent", { length: 500 }),
    source: varchar("source", { length: 100 }),
    status: varchar("status", { length: 20 }).default("success").notNull(),
    severity: varchar("severity", { length: 20 }).default("low").notNull(),
    errorMessage: text("errorMessage"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    metadata: json("metadata"),
  },
  (table) => [
    index("idx_business_action_log_business_id_action_id").on(
      table.businessId,
      table.actionId
    ),
    index("idx_business_action_log_business_id").on(table.businessId),
    index("idx_business_action_log_action_type").on(table.actionType),
    index("idx_business_action_log_user_id").on(table.userId),
    index("idx_business_action_log_status").on(table.status),
  ]
);

export const userProfile = mysqlTable("user_profile", {
  id: int("id").primaryKey().autoincrement(),
  address: text("address"),
  avatar: varchar("avatar", { length: 500 }),
  signature: varchar("signature", { length: 500 }),
  organization: varchar("organization", { length: 50 }),
  contactNumber: varchar("contactNumber", { length: 20 }),
  contactEmail: varchar("contactEmail", { length: 100 }),
  website: varchar("website", { length: 150 }),
  country: varchar("country", { length: 50 }),
  state: varchar("state", { length: 50 }),
  city: varchar("city", { length: 50 }),
  about: varchar("about", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  businessId: int("businessId")
    .notNull()
    .references(() => business.id),
  userId: int("userId")
    .unique()
    .notNull()
    .references(() => users.id),
});

export const customers = mysqlTable(
  "customers",
  {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 20 }),
    cusCode: varchar("cusCode", { length: 50 }).notNull(),
    address: text("address"),
    city: varchar("city", { length: 100 }),
    state: varchar("state", { length: 100 }),
    country: varchar("country", { length: 100 }),
    postalCode: varchar("postalCode", { length: 20 }),
    isActive: boolean("isActive").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    businessId: int("businessId")
      .notNull()
      .references(() => business.id),
  },
  (table) => [
    uniqueIndex("unique_business_cus_code").on(table.businessId, table.cusCode),
    index("idx_customers_business_id").on(table.businessId),
  ]
);

export const items = mysqlTable(
  "items",
  {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    proCode: varchar("proCode", { length: 50 }),
    sku: varchar("sku", { length: 50 }),
    category: varchar("category", { length: 100 }).notNull(),
    catId: int("catId").notNull(),
    unitPrice: decimal("unitPrice", { precision: 10, scale: 2 })
      .default("0")
      .notNull(),
    costPrice: decimal("costPrice", { precision: 10, scale: 2 })
      .default("0")
      .notNull(),
    stockQuantity: decimal("stockQuantity", {
      precision: 10,
      scale: 2,
    }).default("0"),
    minStockLevel: decimal("minStockLevel", {
      precision: 10,
      scale: 2,
    }).default("0"),
    unit: varchar("unit", { length: 20 }).default("pcs").notNull(),
    taxRate: decimal("taxRate", { precision: 10, scale: 2 }).default("0"),
    discountRate: decimal("discountRate", { precision: 10, scale: 2 }).default(
      "0"
    ),
    image: varchar("image", { length: 256 }).default("").notNull(),
    isActive: boolean("isActive").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    businessId: int("businessId")
      .notNull()
      .references(() => business.id),
  },
  (table) => [
    uniqueIndex("unique_business_pro_code").on(table.businessId, table.proCode),
    index("idx_business_item_name").on(table.businessId, table.name),
  ]
);

export const purchaseClient = mysqlTable(
  "purchase_client",
  {
    id: int("id").primaryKey().autoincrement(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 20 }),
    address: text("address"),
    city: varchar("city", { length: 100 }),
    state: varchar("state", { length: 100 }),
    country: varchar("country", { length: 100 }),
    postalCode: varchar("postalCode", { length: 20 }),
    contactPerson: varchar("contactPerson", { length: 255 }),
    taxId: varchar("taxId", { length: 50 }),
    paymentTerms: varchar("paymentTerms", { length: 100 }),
    isActive: boolean("isActive").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    businessId: int("businessId")
      .notNull()
      .references(() => business.id),
  },
  (table) => [
    uniqueIndex("unique_business_email").on(table.businessId, table.email),
  ]
);

export const codeType = mysqlTable(
  "code_type",
  {
    id: int("id").primaryKey().autoincrement(),
    codeType: varchar("codeType", { length: 50 }).notNull(),
    businessId: int("businessId")
      .notNull()
      .references(() => business.id),
  },
  (table) => [
    index("idx_is_code_type_business_id").on(table.businessId),
    index("idx_code_type_code_type").on(table.codeType),
  ]
);

export const codes = mysqlTable(
  "codes",
  {
    id: int("id").primaryKey().autoincrement(),
    businessId: int("businessId")
      .notNull()
      .references(() => business.id),
    codeType: varchar("codeType", { length: 50 }).notNull(),
    codeName: varchar("codeName", { length: 50 }).notNull(),
    codeDesc: varchar("codeDesc", { length: 150 }),
    longDesc: json("longDesc"),
    isActive: boolean("isActive").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    uniqueIndex("unique_business_code_name").on(
      table.businessId,
      table.codeName
    ),
  ]
);

export const invoiceMaster = mysqlTable(
  "invoice_master",
  {
    id: int("id").primaryKey().autoincrement(),
    invoiceNumber: varchar("invoiceNumber", { length: 50 }).notNull(),
    customerId: int("customerId"),
    customerPhone: varchar("customerPhone", { length: 20 }).notNull(),
    customerName: varchar("customerName", { length: 100 }),
    customerEmail: varchar("customerEmail", { length: 100 }),
    customerAddress: varchar("customerAddress", { length: 255 }),
    businessId: int("businessId")
      .notNull()
      .references(() => business.id),
    invoiceDate: timestamp("invoiceDate"),
    dueDate: timestamp("dueDate"),
    subtotal: decimal("subtotal", { precision: 10, scale: 2 })
      .default("0")
      .notNull(),
    dueAmount: decimal("dueAmount", { precision: 10, scale: 2 }).default("0"),
    tax: decimal("tax", { precision: 10, scale: 2 }).default("0"),
    discount: decimal("discount", { precision: 10, scale: 2 }).default("0"),
    deliveryCharge: decimal("deliveryCharge", {
      precision: 10,
      scale: 2,
    }).default("0"),
    totalAmount: decimal("totalAmount", { precision: 10, scale: 2 })
      .default("0")
      .notNull(),
    status: varchar("status", { length: 20 }).default("paid").notNull(),
    notes: text("notes"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    createdBy: int("createdBy")
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 10 }).default("sales").notNull(),
    recordType: int("recordType").default(1).notNull(),
    salesId: int("salesId"),
  },
  (table) => [
    uniqueIndex("unique_business_invoice_number").on(
      table.businessId,
      table.invoiceNumber
    ),
    index("idx_invoicenumber_customerid").on(
      table.customerId,
      table.invoiceNumber
    ),
  ]
);

export const invoiceDetail = mysqlTable(
  "invoice_detail",
  {
    id: int("id").primaryKey().autoincrement(),
    invoiceMasterId: int("invoiceMasterId")
      .notNull()
      .references(() => invoiceMaster.id),
    itemId: int("itemId")
      .notNull()
      .references(() => items.id),
    businessId: int("businessId").notNull(), // No explicit references in Prisma, but logically to business
    itemName: varchar("itemName", { length: 255 }).notNull(),
    description: text("description"),
    quantity: decimal("quantity", { precision: 10, scale: 2 })
      .default("0")
      .notNull(),
    unitPrice: decimal("unitPrice", { precision: 10, scale: 2 })
      .default("0")
      .notNull(),
    lineTotal: decimal("lineTotal", { precision: 10, scale: 2 })
      .default("0")
      .notNull(),
    tax: decimal("tax", { precision: 10, scale: 2 }).default("0"),
    discount: decimal("discount", { precision: 10, scale: 2 }).default("0"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    batchNumber: varchar("batchNumber", { length: 50 }),
    profitId: int("profitId"),
    type: varchar("type", { length: 10 }).default("sales").notNull(),
  },
  (table) => [
    index("idx_invoicedetail_business_invoicemasterid").on(
      table.businessId,
      table.invoiceMasterId
    ),
  ]
);

export const purchases = mysqlTable(
  "purchases",
  {
    id: int("id").primaryKey().autoincrement(),
    purchaseNumber: varchar("purchaseNumber", { length: 50 }).notNull(),
    supplierId: int("supplierId")
      .notNull()
      .references(() => purchaseClient.id),
    supplierName: varchar("supplierName", { length: 100 }).notNull(),
    supplierEmail: varchar("supplierEmail", { length: 100 }).notNull(),
    supplierAddress: varchar("supplierAddress", { length: 255 }),
    supplierPhone: varchar("supplierPhone", { length: 20 }),
    businessId: int("businessId")
      .notNull()
      .references(() => business.id),
    purchaseDate: timestamp("purchaseDate").defaultNow().notNull(),
    expectedDeliveryDate: timestamp("expectedDeliveryDate")
      .defaultNow()
      .notNull(),
    actualDeliveryDate: timestamp("actualDeliveryDate").defaultNow().notNull(),
    subtotal: decimal("subtotal", { precision: 10, scale: 2 })
      .default("0")
      .notNull(),
    taxAmount: decimal("taxAmount", { precision: 10, scale: 2 }).default("0"),
    discountAmount: decimal("discountAmount", {
      precision: 10,
      scale: 2,
    }).default("0"),
    shippingCost: decimal("shippingCost", { precision: 10, scale: 2 }).default(
      "0"
    ),
    totalAmount: decimal("totalAmount", { precision: 10, scale: 2 })
      .default("0")
      .notNull(),
    status: varchar("status", { length: 20 }).default("paid").notNull(),
    paymentStatus: varchar("paymentStatus", { length: 20 })
      .default("unpaid")
      .notNull(),
    notes: text("notes"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    createdBy: int("createdBy")
      .notNull()
      .references(() => users.id),
    recordType: int("recordType").default(1).notNull(),
  },
  (table) => [
    uniqueIndex("unique_business_purchase_number").on(
      table.businessId,
      table.purchaseNumber
    ),
  ]
);

export const purchaseBatch = mysqlTable(
  "purchase_batch",
  {
    id: int("id").primaryKey().autoincrement(),
    businessId: int("businessId")
      .notNull()
      .references(() => business.id),
    itemId: int("itemId")
      .notNull()
      .references(() => items.id),
    batchNumber: varchar("batchNumber", { length: 20 }).notNull(),
    receivedQty: decimal("receivedQty", { precision: 10, scale: 2 }).notNull(),
    remainingQty: decimal("remainingQty", {
      precision: 10,
      scale: 2,
    }).notNull(),
    unitCost: decimal("unitCost", { precision: 10, scale: 2 }).notNull(),
    sellPrice: decimal("sellPrice", { precision: 10, scale: 2 }).notNull(),
    receivedAt: timestamp("receivedAt").defaultNow().notNull(),
    purchaseId: int("purchaseId")
      .notNull()
      .references(() => purchases.id),
  },
  (table) => [
    index("idx_purchase_batch_business_item").on(
      table.businessId,
      table.itemId
    ),
  ]
);

export const profitLog = mysqlTable(
  "profit_log",
  {
    id: int("id").primaryKey().autoincrement(),
    businessId: int("businessId")
      .notNull()
      .references(() => business.id),
    invoiceDetailId: int("invoiceDetailId")
      .notNull()
      .references(() => invoiceDetail.id),
    itemId: int("itemId")
      .notNull()
      .references(() => items.id),
    quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(),
    costPerUnit: decimal("costPerUnit", { precision: 10, scale: 2 }).notNull(),
    sellingPerUnit: decimal("sellingPerUnit", {
      precision: 10,
      scale: 2,
    }).notNull(),
    profit: decimal("profit", { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    type: int("type").default(1).notNull(),
    invoiceMasterId: int("invoiceMasterId"),
  },
  (table) => [
    index("idx_profit_log_business_invoicedetail").on(
      table.businessId,
      table.invoiceDetailId
    ),
  ]
);

export const businessStats = mysqlTable(
  "business_stats",
  {
    id: int("id").primaryKey().autoincrement(),
    businessId: int("businessId")
      .unique()
      .notNull()
      .references(() => business.id),
    customers: int("customers").default(0).notNull(),
    items: int("items").default(0).notNull(),
    employees: int("employees").default(0).notNull(),
    invoices: int("invoices").default(0).notNull(),
    purchases: int("purchases").default(0).notNull(),
    suppliers: int("suppliers").default(0).notNull(),
  },
  (table) => [index("idx_business_stats_business_id").on(table.businessId)]
);

export const collections = mysqlTable(
  "collections",
  {
    id: int("id").primaryKey().autoincrement(),
    type: varchar("type", { length: 20 }).default("customer").notNull(),
    moveType: varchar("moveType", { length: 10 }).default("in").notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 })
      .default("0")
      .notNull(),
    collectionNumber: varchar("collectionNumber", { length: 50 }).notNull(),
    customerId: int("customerId"),
    supplierId: int("supplierId"),
    salesId: int("salesId"),
    purchaseId: int("purchaseId"),
    businessId: int("businessId").notNull(),
    userId: int("userId").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    index("idx_collections_businessid_collectionnumber").on(
      table.businessId,
      table.collectionNumber
    ),
  ]
);

export const account = mysqlTable(
  "accounts",
  {
    id: int("id").primaryKey().autoincrement(),
    businessId: int("businessId")
      .notNull()
      .references(() => business.id),
    name: varchar("name", { length: 100 }).notNull(),
    code: varchar("code", { length: 20 }),
    type: varchar("type", { length: 30 }).notNull(),
    subtype: varchar("subtype", { length: 50 }),
    isSystem: boolean("isSystem").default(false).notNull(),
    isActive: boolean("isActive").default(true).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    index("idx_accounts_business_type").on(table.businessId, table.type),
  ]
);

export const journal = mysqlTable(
  "journals",
  {
    id: int("id").primaryKey().autoincrement(),
    businessId: int("businessId")
      .notNull()
      .references(() => business.id),
    refType: varchar("refType", { length: 30 }).notNull(),
    refId: int("refId"),
    date: timestamp("date").defaultNow().notNull(),
    description: text("description"),
    createdBy: int("createdBy").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    index("idx_journals_business_ref_type").on(table.businessId, table.refType),
  ]
);

export const accountEntry = mysqlTable(
  "account_entries",
  {
    id: int("id").primaryKey().autoincrement(),
    journalId: int("journalId")
      .notNull()
      .references(() => journal.id),
    accountId: int("accountId")
      .notNull()
      .references(() => account.id),
    debit: decimal("debit", { precision: 12, scale: 2 }).default("0").notNull(),
    credit: decimal("credit", { precision: 12, scale: 2 })
      .default("0")
      .notNull(),
    businessId: int("businessId"),
  },
  (table) => [index("idx_account_entries_account_id").on(table.accountId)]
);

export const expense = mysqlTable("expenses", {
  id: int("id").primaryKey().autoincrement(),
  businessId: int("businessId")
    .notNull()
    .references(() => business.id),
  categoryId: int("categoryId")
    .notNull()
    .references(() => codes.id),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentType: varchar("paymentType", { length: 20 }).notNull(),
  notes: text("notes"),
  expenseDate: timestamp("expenseDate").defaultNow().notNull(),
  createdBy: int("createdBy").notNull(),
  journalId: int("journalId").references(() => journal.id),
});
