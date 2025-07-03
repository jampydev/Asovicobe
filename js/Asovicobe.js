



document.addEventListener('DOMContentLoaded', () => {


    

    // Base de datos de Jampier (NO editable)
    const jampierDatabase = [
        

        { 
            
            day: "#", 
            date: "#", 
            time: "#", 
            completed: true,
            isJampier: true  // Identificador
            
        },
        




  //{ 
            
            //day: "TERMINADO...", 
            //date: "TERMINADO...",
            //time: "TERMINADO...",

        
        //}, 










    ];




    // Elementos del DOM
    const dayInput = document.getElementById('day');
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('time');
    const saveBtn = document.getElementById('saveBtn');
    const dataList = document.getElementById('dataList');
    const modal = document.getElementById('modal');
    const modalText = document.getElementById('modalText');
    const closeModal = document.querySelector('.close-modal');

    // Cargar datos al iniciar
    loadData();

    // Guardar datos en localStorage (solo datos de usuario)
    saveBtn.addEventListener('click', () => {
        const day = dayInput.value.trim();
        const date = dateInput.value.trim();
        const time = timeInput.value.trim();

        if (!day || !date || !time) {
            showModal('⚠️ Todos los campos son obligatorios');
            return;
        }

        const newData = { day, date, time, completed: false, isJampier: false };
        saveToLocalStorage(newData);
        renderData();
        clearInputs();
        showModal('✅ Turno guardado (solo en este dispositivo)');
    });

    // Cargar y combinar datos (Jampier + localStorage)
    function loadData() {
        if (!localStorage.getItem('asovicobe_data')) {
            localStorage.setItem('asovicobe_data', JSON.stringify([]));
        }
        renderData();
    }

    // Renderizar TODOS los datos
    function renderData() {
        dataList.innerHTML = '';
        const userData = JSON.parse(localStorage.getItem('asovicobe_data')) || [];
        const allData = [...jampierDatabase, ...userData]; // Combinar

        allData.forEach((item, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div>
                    <strong>${item.day}</strong><br>
                    <span>${item.date} | ${item.time}</span>
                </div>
                <div class="actions">
                    <button class="complete" onclick="toggleComplete(${index}, ${item.isJampier})">
                        <i class="fas fa-${item.completed ? 'check-circle' : 'circle'}"></i>
                    </button>
                    ${item.isJampier ? '' : `<button class="delete" onclick="deleteData(${index})">
                        <i class="fas fa-times"></i>
                    </button>`}
                </div>
            `;
            if (item.completed) {
                li.style.opacity = '0.7';
                li.style.borderLeft = '4px solid var(--success)';
            }
            dataList.appendChild(li);
        });
    }

    // Guardar en localStorage (datos de usuario)
    function saveToLocalStorage(data) {
        let userData = JSON.parse(localStorage.getItem('asovicobe_data')) || [];
        userData.push(data);
        localStorage.setItem('asovicobe_data', JSON.stringify(userData));
    }

    // ----- Funciones Globales -----
    // Marcar como completado
    window.toggleComplete = (index, isJampier) => {
        if (isJampier) {
            showModal('❌ No puedes modificar ni eliminar estos datos de la base de Jampier.');
            return;
        }
        let userData = JSON.parse(localStorage.getItem('asovicobe_data')) || [];
        userData[index - jampierDatabase.length].completed = !userData[index - jampierDatabase.length].completed;
        localStorage.setItem('asovicobe_data', JSON.stringify(userData));
        renderData();
    };

    // Eliminar dato (solo datos de usuario)
    window.deleteData = (index) => {
        let userData = JSON.parse(localStorage.getItem('asovicobe_data')) || [];
        userData.splice(index - jampierDatabase.length, 1);
        localStorage.setItem('asovicobe_data', JSON.stringify(userData));
        renderData();
        showModal('🗑️ Turno eliminado');
    };

    // ----- Helpers -----
    function showModal(message) {
        modalText.textContent = message;
        modal.style.display = 'flex';
    }

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    function clearInputs() {
        dayInput.value = '';
        dateInput.value = '';
        timeInput.value = '';
    }
});
