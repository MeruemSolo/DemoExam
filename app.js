class FamilyBudget {
    constructor() {
        this.familyMembers = [];
        this.transactions = [];
        this.initializeEventListeners();
        this.loadData();
    }

    initializeEventListeners() {
        const form = document.getElementById('transactionForm');
        form.addEventListener('submit', (e) => this.handleTransactionSubmit(e));
    }

    loadData() {
        try {
            console.log('Начало загрузки данных...');
            
            const savedMembers = localStorage.getItem('familyMembers');
            if (savedMembers) {
                this.familyMembers = JSON.parse(savedMembers);
            } else {
                const familyData = [
                    { 'ФИО': 'Иванов Иван Петрович', 'Дата рождения': '6/15/1985' },
                    { 'ФИО': 'Иванова Мария Сергеевна', 'Дата рождения': '9/20/1987' },
                    { 'ФИО': 'Иванов Алексей Иванович', 'Дата рождения': '2/5/2010' },
                    { 'ФИО': 'Иванова Елена Викторовна', 'Дата рождения': '3/10/1959' },
                    { 'ФИО': 'Петров Сергей Александрович', 'Дата рождения': '12/5/1982' }
                ];

                const jobsData = [
                    { 'ФИО': 'Иванов Иван Петрович', 'Текущая должность': 'Инженер', 'Организация': 'ООО "ТехноСервис"', 'Оклад': '85000', 'Дата начала': '3/1/2015' },
                    { 'ФИО': 'Иванова Мария Сергеевна', 'Текущая должность': 'Бухгалтер', 'Организация': 'АО "ФинансГрупп"', 'Оклад': '75000', 'Дата начала': '4/15/2012' },
                    { 'ФИО': 'Иванова Елена Викторовна', 'Текущая должность': 'Репетитор', 'Организация': 'Частная практика', 'Оклад': '15000', 'Дата начала': '1/10/2020' },
                    { 'ФИО': 'Петров Сергей Александрович', 'Текущая должность': 'Таксист', 'Организация': 'Индивидуальная работа', 'Оклад': '30000', 'Дата начала': '9/1/2020' }
                ];

                this.familyMembers = familyData.map((member, index) => {
                    const jobInfo = jobsData.find(job => job['ФИО'] === member['ФИО']);
                    return {
                        id: `member-${index + 1}`,
                        name: member['ФИО'],
                        birthDate: member['Дата рождения'],
                        position: jobInfo ? jobInfo['Текущая должность'] : 'Нет данных',
                        organization: jobInfo ? jobInfo['Организация'] : 'Нет данных',
                        salary: jobInfo ? parseFloat(jobInfo['Оклад']) : 0,
                        startDate: jobInfo ? jobInfo['Дата начала'] : 'Нет данных'
                    };
                });

                localStorage.setItem('familyMembers', JSON.stringify(this.familyMembers));
            }
            
            console.log('Итоговые данные о членах семьи:', this.familyMembers);
            
            this.displayFamilyMembers();
            
            this.calculateBudgetStatus();
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            const container = document.getElementById('familyMembersList');
            container.innerHTML = `<div class="error-message">Ошибка загрузки данных: ${error.message}</div>`;
        }
    }

    displayFamilyMembers() {
        const container = document.getElementById('familyMembersList');
        if (!this.familyMembers.length) {
            container.innerHTML = '<div class="no-data">Нет данных о членах семьи</div>';
            return;
        }
        
        container.innerHTML = this.familyMembers.map(member => `
            <div class="member-card" onclick="window.location.href='edit-member.html?id=${member.id}'">
                <h3>${member.name}</h3>
                <p><strong>Дата рождения:</strong> ${member.birthDate}</p>
                <p><strong>Должность:</strong> ${member.position}</p>
                <p><strong>Организация:</strong> ${member.organization}</p>
                <p><strong>Оклад:</strong> ${member.salary} ₽</p>
                <p><strong>Дата начала работы:</strong> ${member.startDate}</p>
            </div>
        `).join('');
    }

    handleTransactionSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const transaction = {
            amount: parseFloat(formData.get('amount')),
            category: formData.get('category'),
            date: formData.get('date'),
            type: formData.get('type')
        };

        this.transactions.push(transaction);
        this.calculateBudgetStatus();
        event.target.reset();
    }

    calculateBudgetStatus() {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const monthlyTransactions = this.transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return transactionDate.getMonth() === currentMonth && 
                   transactionDate.getFullYear() === currentYear;
        });

        const totalIncome = monthlyTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpenses = monthlyTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const statusContainer = document.getElementById('budgetStatus');
        const status = totalIncome > totalExpenses ? 'Профицит бюджета' : 'Дефицит бюджета';
        const color = totalIncome > totalExpenses ? '#4CAF50' : '#f44336';

        statusContainer.innerHTML = `
            <div style="color: ${color}">
                <h3>Статус бюджета за текущий месяц:</h3>
                <p>Доходы: ${totalIncome.toFixed(2)} ₽</p>
                <p>Расходы: ${totalExpenses.toFixed(2)} ₽</p>
                <p>${status}</p>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FamilyBudget();
}); 