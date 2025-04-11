// RouteManager.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'http://localhost:5000/routes'; // Ajusta si usas otro puerto

const RouteManager = () => {
  const [routes, setRoutes] = useState([]);
  const [formData, setFormData] = useState({
    routeName: '',
    origin: '',
    destination: '',
    distance: ''
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch routes al cargar
  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    const res = await axios.get(API_URL);
    setRoutes(res.data);
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`${API_URL}/${editingId}`, formData);
    } else {
      await axios.post(API_URL, formData);
    }
    setFormData({ routeName: '', origin: '', destination: '', distance: '' });
    setEditingId(null);
    fetchRoutes();
  };

  const handleEdit = route => {
    setFormData(route);
    setEditingId(route._ID);
  };

  const handleDelete = async id => {
    if (window.confirm('¿Seguro que quieres eliminar esta ruta?')) {
      await axios.delete(`${API_URL}/${id}`);
      fetchRoutes();
    }
  };

  return (
    <div className="container mt-4">
      <h2>Gestión de Rutas</h2>

      <form onSubmit={handleSubmit} className="row g-3 mb-4">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Nombre de ruta"
            name="routeName"
            value={formData.routeName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Origen"
            name="origin"
            value={formData.origin}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Destino"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-2">
          <input
            type="number"
            className="form-control"
            placeholder="Distancia"
            name="distance"
            value={formData.distance}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">{editingId ? 'Actualizar' : 'Registrar'}</button>
        </div>
      </form>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Ruta</th>
            <th>Origen</th>
            <th>Destino</th>
            <th>Distancia</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route, index) => (
            <tr key={route._ID}>
              <td>{route.routeName}</td>
              <td>{route.origin}</td>
              <td>{route.destination}</td>
              <td>{route.distance}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(route)}>Editar</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(route._ID)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RouteManager;
