
<div className="producto-group">
<h2 className="h2-servicio">Datos factura</h2>
<div className="inputgroupCV">
  <span className="iconCV">
    <BsFillPersonFill />
  </span>
  <input
    className="inputCV"
    placeholder="Numero factura"
    autoComplete="nope"
    type="text"
    value={facturaClienteData.numeroFactura}
            onChange={(e) =>
              setFacturaClienteData((prev) => ({
                ...prev,
                numeroFactura: e.target.value,
              }))
            }
  />
</div>

<div className="inputgroupCV-f">
  <span className="iconCV-f">
  Estado
  </span>
  <select className="inputCV-f"
      value={facturaClienteData.estado}
      onChange={(e) =>
        setFacturaClienteData((prev) => ({
          ...prev,
          estado: e.target.value,
        }))
      }
    >
      <option value="pagada">Pagada</option>
      <option value="pendiente">Pendiente</option>
      <option value="vencida">Vencida</option>
    </select>
</div>
<div className="inputgroupCV-f">
  <span className="iconCV-f">
  Emisión
  </span>
  <input
    className="inputCV-f"
    placeholder="Fecha emision"
    autoComplete="nope"
    type="date"
    value={facturaClienteData.fechaEmision}
    onChange={(e) =>
      setFacturaClienteData((prev) => ({
        ...prev,
        fechaEmision: e.target.value,
      }))
    }
  />
</div>

<div className="inputgroupCV-f">
  <span className="iconCV-f">
  Operación
  </span>
  <input
    className="inputCV-f"
    placeholder="Fecha operación"
    autoComplete="nope"
    type="date"
    value={facturaClienteData.fechaOperacion}
              onChange={(e) =>
                setFacturaClienteData((prev) => ({
                  ...prev,
                  fechaOperacion: e.target.value,
                }))
              }
  />
</div>
<div className="inputgroupCV">
  <span className="iconCV">
    <BsFillPersonFill />
  </span>
  <textarea
    className="inputCV"
    autoComplete="nope"
    value={facturaClienteData.detalles}
              onChange={(e) =>
                setFacturaClienteData((prev) => ({
                  ...prev,
                  detalles: e.target.value,
                }))
              }
    placeholder="Descripción"
  />
</div>



<div className="inputgroupCV">
  <span className="iconCV">
    <BsFillPersonFill />
  </span>
  <input
    className="inputCV"
    autoComplete="nope"
    type="text"
    value={facturaClienteData.iva}
    onChange={(e) =>
      setFacturaClienteData((prev) => ({
        ...prev,
        iva: parseFloat(e.target.value),
      }))
    }
    placeholder="IVA"
    required
  />
</div>
<div className="inputgroupCV">
  <span className="iconCV">
    <BsFillPersonFill />
  </span>
  <input
    className="inputCV"
    autoComplete="nope"
    type="text"
    value={facturaClienteData.cuotaTributaria}
    onChange={(e) =>
      setFacturaClienteData((prev) => ({
        ...prev,
        cuotaTributaria: e.target.value,
      }))
    }
    placeholder="Cuota Tributaria"
    required
  />
</div>

<div className="inputgroupCV">
  <span className="iconCV">
    <BsFillPersonFill />
  </span>
  <input
    className="inputCV"
    autoComplete="nope"
    type="text"
    value={facturaClienteData.servicio}
              onChange={(e) =>
                setFacturaClienteData((prev) => ({
                  ...prev,
                  servicio: e.target.value,
                }))
              }
    placeholder="Servicio adicional"
    required
  />
</div>


<div className="inputgroupCV">
  <span className="iconCV">
    <BsFillPersonFill />
  </span>
  <input
    className="inputCV"
    autoComplete="nope"
    type="text"
    value={facturaClienteData.valorServicio}
              onChange={(e) =>
                setFacturaClienteData((prev) => ({
                  ...prev,
                  valorServicio: parseFloat(e.target.value),
                }))
              }
    placeholder="Precio servicio"
    required
  />
</div>

</div>