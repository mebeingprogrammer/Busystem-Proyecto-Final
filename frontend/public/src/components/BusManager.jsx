import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'http://localhost:5000/buses'; // Ajusta si usas otro puerto

const BusManager = () => {
  const [buses, setBuses] = useState([]);
  const [formData, setFormData] = useState({
    busNumber: '',
    model: '',
    capacity: '',
    year: '',
    status: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch buses al cargar
  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(API_URL);
      setBuses(res.data);
    } catch (error) {
      setErrorMessage('Error al obtener los buses.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      setFormData({ busNumber: '', model: '', capacity: '', year: '', status: '' });
      setEditingId(null);
      fetchBuses();
    } catch (error) {
      setErrorMessage('Error al guardar los datos.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = bus => {
    setFormData(bus);
    setEditingId(bus._ID);
  };

  const handleDelete = async id => {
    if (window.confirm('¿Seguro que quieres eliminar este bus?')) {
      try {
        setIsLoading(true);
        await axios.delete(`${API_URL}/${id}`);
        fetchBuses();
      } catch (error) {
        setErrorMessage('Error al eliminar el bus.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>Gestión de Buses</h2>

      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

      <form onSubmit={handleSubmit} className="row g-3 mb-4">
        <div className="col-md-4">
          <input type="text" className="form-control" placeholder="Número de bus" name="busNumber" value={formData.busNumber} onChange={handleChange} required />
        </div>
        <div className="col-md-4">
          <input type="text" className="form-control" placeholder="Modelo" name="model" value={formData.model} onChange={handleChange} required />
        </div>
        <div className="col-md-2">
          <input type="number" className="form-control" placeholder="Capacidad" name="capacity" value={formData.capacity} onChange={handleChange} required />
        </div>
        <div className="col-md-2">
          <input type="number" className="form-control" placeholder="Año" name="year" value={formData.year} onChange={handleChange} required />
        </div>
        <div className="col-md-4">
          <select className="form-select" name="status" value={formData.status} onChange={handleChange} required>
            <option value="">Selecciona estado</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
        <div className="col-12">
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? 'Guardando...' : editingId ? 'Actualizar' : 'Registrar'}
          </button>
        </div>
      </form>

      {isLoading ? (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Modelo</th>
              <th>Capacidad</th>
              <th>Año</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {buses.map((bus, index) => (
              <tr key={bus._ID}>
                <td>{bus.busNumber}</td>
                <td>{bus.model}</td>
                <td>{bus.capacity}</td>
                <td>{bus.year}</td>
                <td>{bus.status}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(bus)}>Editar</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(bus._ID)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BusManager;
