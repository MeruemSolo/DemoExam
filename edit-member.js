// Класс для управления формой редактирования члена семьи
class MemberForm {
    constructor() {
        this.form = document.getElementById('memberForm');
        this.initializeEventListeners();
        this.loadMemberData();
    }

    // Инициализация обработчиков событий
    initializeEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Добавляем валидацию в реальном времени
        const nameInput = document.getElementById('name');
        const salaryInput = document.getElementById('salary');
        
        nameInput.addEventListener('input', () => this.validateName(nameInput));
        salaryInput.addEventListener('input', () => this.validateSalary(salaryInput));
    }

    // Загрузка данных члена семьи (если редактирование)
    loadMemberData() {
        const urlParams = new URLSearchParams(window.location.search);
        const memberId = urlParams.get('id');
        
        if (memberId) {
            // Получаем данные из localStorage
            const members = JSON.parse(localStorage.getItem('familyMembers') || '[]');
            const member = members.find(m => m.id === memberId);
            
            if (member) {
                // Заполняем форму данными
                document.getElementById('name').value = member.name;
                document.getElementById('birthDate').value = member.birthDate;
                document.getElementById('position').value = member.position;
                document.getElementById('organization').value = member.organization;
                document.getElementById('salary').value = member.salary;
            }
        }
    }

    // Валидация имени
    validateName(input) {
        const errorElement = document.getElementById('nameError');
        if (!input.value.trim()) {
            errorElement.textContent = 'ФИО не может быть пустым';
            return false;
        }
        errorElement.textContent = '';
        return true;
    }

    // Валидация зарплаты
    validateSalary(input) {
        const errorElement = document.getElementById('salaryError');
        const value = parseFloat(input.value);
        
        if (isNaN(value) || value < 0) {
            errorElement.textContent = 'Доход не может быть отрицательным числом';
            return false;
        }
        errorElement.textContent = '';
        return true;
    }

    // Обработка отправки формы
    handleSubmit(event) {
        event.preventDefault();
        
        const nameInput = document.getElementById('name');
        const salaryInput = document.getElementById('salary');
        
        // Проверяем валидацию
        if (!this.validateName(nameInput) || !this.validateSalary(salaryInput)) {
            return;
        }

        // Собираем данные формы
        const formData = new FormData(this.form);
        const memberData = {
            id: new URLSearchParams(window.location.search).get('id') || Date.now().toString(),
            name: formData.get('name'),
            birthDate: formData.get('birthDate'),
            position: formData.get('position'),
            organization: formData.get('organization'),
            salary: parseFloat(formData.get('salary'))
        };

        // Получаем текущий список членов семьи
        const members = JSON.parse(localStorage.getItem('familyMembers') || '[]');
        
        // Обновляем или добавляем члена семьи
        const index = members.findIndex(m => m.id === memberData.id);
        if (index !== -1) {
            members[index] = memberData;
        } else {
            members.push(memberData);
        }

        // Сохраняем обновленный список
        localStorage.setItem('familyMembers', JSON.stringify(members));

        // Показываем сообщение об успехе
        this.showMessage('Успешно', 'Данные члена семьи сохранены', 'success');
        
        // Возвращаемся на главную страницу через 1 секунду
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }

    // Отображение сообщений
    showMessage(title, message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.innerHTML = `
            <h3>${title}</h3>
            <p>${message}</p>
        `;
        
        document.body.appendChild(messageDiv);
        
        // Удаляем сообщение через 3 секунды
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}

// Инициализация формы при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    new MemberForm();
}); 