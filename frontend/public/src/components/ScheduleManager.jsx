// ScheduleManager.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL_SCHEDULES = 'http://localhost:5000/schedules'; // Ajusta si usas otro puerto
const API_URL_BUSES = 'http://localhost:5000/buses'; // Para obtener autobuses
const API_URL_ROUTES = 'http://localhost:5000/routes'; // Para obtener rutas

const ScheduleManager = () => {
  const [schedules, setSchedules] = useState([]);
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [formData, setFormData] = useState({
    busId: '',
    routeId: '',
    departureTime: '',
    arrivalTime: ''
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch schedules, buses, and routes al cargar
  useEffect(() => {
    fetchSchedules();
    fetchBuses();
    fetchRoutes();
  }, []);

  const fetchSchedules = async () => {
    const res = await axios.get(API_URL_SCHEDULES);
    setSchedules(res.data);
  };

  const fetchBuses = async () => {
    const res = await axios.get(API_URL_BUSES);
    setBuses(res.data);
  };

  const fetchRoutes = async () => {
    const res = await axios.get(API_URL_ROUTES);
    setRoutes(res.data);
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`${API_URL_SCHEDULES}/${editingId}`, formData);
    } else {
      await axios.post(API_URL_SCHEDULES, formData);
    }
    setFormData({ busId: '', routeId: '', departureTime: '', arrivalTime: '' });
    setEditingId(null);
    fetchSchedules();
  };

  const handleEdit = schedule => {
    setFormData(schedule);
    setEditingId(schedule._ID);
  };

  const handleDelete = async id => {
    if (window.confirm('¿Seguro que quieres eliminar este horario?')) {
      await axios.delete(`${API_URL_SCHEDULES}/${id}`);
      fetchSchedules();
    }
  };

  return (
    <div className="container mt-4">
      <h2>Gestión de Horarios</h2>

      <form onSubmit={handleSubmit} className="row g-3 mb-4">
        <div className="col-md-4">
          <select
            className="form-select"
            name="busId"
            value={formData.busId}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona autobús</option>
            {buses.map(bus => (
              <option key={bus._ID} value={bus._ID}>
                {bus.busNumber} - {bus.model} - {bus.capacity}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            name="routeId"
            value={formData.routeId}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona ruta</option>
            {routes.map(route => (
              <option key={route._ID} value={route._ID}>
                {route.origin} - {route.destination}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <input
            type="datetime-local"
            className="form-control"
            placeholder="Hora de salida"
            name="departureTime"
            value={formData.departureTime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4">
          <input
            type="datetime-local"
            className="form-control"
            placeholder="Hora de llegada"
            name="arrivalTime"
            value={formData.arrivalTime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            {editingId ? 'Actualizar' : 'Registrar'}
          </button>
        </div>
      </form>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Autobús</th>
            <th>Ruta</th>
            <th>Hora de salida</th>
            <th>Hora de llegada</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map(schedule => (
            <tr key={schedule._ID}>
              <td>{schedule.busId}</td>
              <td>{buses.find(bus => bus._ID === schedule.busId)?.busNumber}</td>
              <td>{routes.find(route => route._ID === schedule.routeId)?.origin} - {routes.find(route => route._ID === schedule.routeId)?.destination}</td>
              <td>{new Date(schedule.departureTime).toLocaleString()}</td>
              <td>{new Date(schedule.arrivalTime).toLocaleString()}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(schedule)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(schedule._ID)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleManager;
