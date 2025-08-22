import React, { useState, useEffect } from 'react';

// Componente principal de la aplicación.
const App = () => {
  // Estado para la lista de planetas registrados.
  const [planets, setPlanets] = useState([]);
  // Estado para el formulario de entrada.
  const [formData, setFormData] = useState({ id: null, name: '', description: '', image: '' });
  // Estado para el planeta que se está editando.
  const [editingPlanet, setEditingPlanet] = useState(null);
  // Estado para mostrar los detalles de un planeta.
  const [selectedPlanet, setSelectedPlanet] = useState(null);

  // Hook useEffect para cargar datos de localStorage al iniciar.
  useEffect(() => {
    try {
      const storedPlanets = JSON.parse(localStorage.getItem('exploration-log-planets'));
      if (storedPlanets) {
        setPlanets(storedPlanets);
      }
    } catch (error) {
      console.error("No se pudieron cargar los datos de localStorage:", error);
    }
  }, []);

  // Hook useEffect para guardar datos en localStorage cada vez que 'planets' cambia.
  useEffect(() => {
    try {
      localStorage.setItem('exploration-log-planets', JSON.stringify(planets));
    } catch (error) {
      console.error("No se pudieron guardar los datos en localStorage:", error);
    }
  }, [planets]);

  // Maneja los cambios en los campos de texto del formulario.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Maneja la carga de la imagen, convirtiéndola a Base64.
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Maneja el envío del formulario para agregar o editar un planeta.
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingPlanet) {
      // Si estamos editando, actualiza el planeta existente.
      setPlanets(planets.map(p =>
        p.id === editingPlanet.id ? { ...p, ...formData } : p
      ));
      setEditingPlanet(null); // Sale del modo de edición.
    } else {
      // Si no, agrega un nuevo planeta.
      const newPlanet = { ...formData, id: Date.now() }; // ID único basado en el timestamp.
      setPlanets([...planets, newPlanet]);
    }
    setFormData({ id: null, name: '', description: '', image: '' }); // Limpia el formulario.
  };

  // Inicia el proceso de edición de un planeta.
  const handleEdit = (planet) => {
    setEditingPlanet(planet);
    setFormData(planet);
    setSelectedPlanet(null); // Oculta el detalle si está visible.
  };

  // Elimina un planeta de la lista.
  const handleDelete = (id) => {
    setPlanets(planets.filter(p => p.id !== id));
    setSelectedPlanet(null); // Oculta el detalle si el planeta eliminado estaba seleccionado.
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-8 flex flex-col items-center">
      <div className="bg-gray-800 rounded-3xl p-6 sm:p-10 max-w-4xl w-full shadow-2xl border border-gray-700 backdrop-filter backdrop-blur-lg">
        
        {/* Encabezado */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-wide">
            Bitácora de Exploración 🪐
          </h1>
          <p className="mt-2 text-gray-400">Registra tus descubrimientos cósmicos.</p>
        </div>

        {/* Sección del Formulario */}
        <div className="bg-gray-700/50 p-6 rounded-2xl mb-8 border border-gray-600">
          <h2 className="text-xl font-bold mb-4 text-purple-300">
            {editingPlanet ? 'Editar Planeta' : 'Añadir Nuevo Planeta'}
          </h2>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-300 mb-1">Nombre del Planeta</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full p-3 rounded-lg bg-gray-600 border border-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-gray-300 mb-1">Descripción</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="4"
                className="w-full p-3 rounded-lg bg-gray-600 border border-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              ></textarea>
            </div>
            <div>
              <label htmlFor="image" className="block text-gray-300 mb-1">Imagen (opcional)</label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-violet-50 file:text-violet-700
                  hover:file:bg-violet-100"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
            >
              {editingPlanet ? 'Guardar Cambios' : 'Registrar Planeta'}
            </button>
            {editingPlanet && (
              <button
                type="button"
                onClick={() => {
                  setEditingPlanet(null);
                  setFormData({ id: null, name: '', description: '', image: '' });
                }}
                className="w-full mt-2 bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-transform transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-gray-500/50"
              >
                Cancelar Edición
              </button>
            )}
          </form>
        </div>

        {/* Sección de la Bitácora */}
        <div className="bg-gray-700/50 p-6 rounded-2xl border border-gray-600">
          <h2 className="text-xl font-bold mb-4 text-green-300">Bitácora de Exploración</h2>
          {planets.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              Aún no hay planetas registrados en tu bitácora.
            </p>
          ) : (
            <div className="space-y-4">
              {planets.map((planet) => (
                <div
                  key={planet.id}
                  className="bg-white/10 p-4 rounded-xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between backdrop-blur-sm cursor-pointer hover:bg-white/20 transition-colors duration-200"
                >
                  <div className="flex-1" onClick={() => setSelectedPlanet(planet)}>
                    <h3 className="text-lg font-semibold text-gray-100">{planet.name}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2">{planet.description}</p>
                  </div>
                  <div className="flex space-x-2 mt-4 sm:mt-0 sm:ml-4">
                    <button
                      onClick={() => handleEdit(planet)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full text-xs transition-transform transform hover:scale-105 active:scale-95"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(planet.id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full text-xs transition-transform transform hover:scale-105 active:scale-95"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal de detalles */}
        {selectedPlanet && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-xl relative border border-gray-700">
              <button
                onClick={() => setSelectedPlanet(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-blue-300 mb-2">{selectedPlanet.name}</h3>
                {selectedPlanet.image && (
                  <img
                    src={selectedPlanet.image}
                    alt={selectedPlanet.name}
                    className="w-full h-auto rounded-lg my-4 object-cover"
                  />
                )}
                <p className="text-gray-300 leading-relaxed text-left">{selectedPlanet.description}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default App;
