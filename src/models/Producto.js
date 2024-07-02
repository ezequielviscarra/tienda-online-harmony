import mongoose from "mongoose";

const productoSchema = new mongoose.Schema(
  {
    Proveedor: {
      type: String,
      required: true,
    },
    Codigo: {
      type: String,
      required: true,
    },

    Rubro: {
      type: String,
      required: true,
    },
    Descripcion: {
      type: String,
      required: true,
    },
    Marca: {
      type: String,
      required: true,
    },
    PrecioVenta: {
      type: Number,
      required: true,
    },
    PrecioCompra: {
      type: Number,
      required: true,
    },
    Lista2: {
      type: Number,
      required: true,
    },
    Lista3: {
      type: Number,
      required: true,
    },
    Lista4: {
      type: Number,
      required: true,
    },
    Lista5: {
      type: Number,
      required: true,
    },
    StockInicial: {
      type: Number,
      required: true,
    },
    StockMinimo: {
      type: Number,
      required: true,
    },
    Stock: {
      type: Number,
      required: true,
    },
    AlicuotaIva: {
      type: Number,
      required: true,
    },
    FechaCompra: {
      type: Number,
      required: true,
    },
    FechasModif: {
      PrecioVenta: { type: Date, default: null },
      PrecioCompra: { type: Date, default: null },
      Lista2: { type: Date, default: null },
      Lista3: { type: Date, default: null },
      Lista4: { type: Date, default: null },
      Lista5: { type: Date, default: null },
      Stock: { type: Date, default: null },
    },
    Unidad: {
      type: String,
      default: "UNIDAD",
    },
    PorcentajeGanancia: {
      type: Number,
      required: true,
    },
    EnPromocion: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.models.Producto ||
  mongoose.model("Producto", productoSchema);
