document.addEventListener('DOMContentLoaded', () => {
    const apiRoutes = [
        {
            title: "CADASTRAR",
            description: "Cria uma nova conta de usuário. Um email de boas-vindas é enviado e um token de autenticação é retornado nos cookies.",
            requests: ["name", "email", "password"],
            link: "/auth/register"
        },
        {
            title: "LOGIN",
            description: "Autentica um usuário existente e retorna um token de autenticação nos cookies.",
            requests: ["email", "password"],
            link: "/auth/login"
        },
        {
            title: "LOGOUT",
            description: "Desloga o usuário, removendo o token de autenticação dos cookies.",
            requests: ["(Nenhum corpo de requisição)"],
            link: "/auth/logout"
        },
        {
            title: "ENVIAR OTP (VERIFICAÇÃO)",
            description: "Envia um código OTP (One-Time Password) para o email do usuário, usado para verificação da conta.",
            requests: ["userId"],
            link: "/auth/send-verify-otp"
        },
        {
            title: "VERIFICAR CONTA",
            description: "Verifica a conta do usuário usando o código OTP recebido por email.",
            requests: ["userId", "otp"],
            link: "/auth/verify-account"
        },
        {
            title: "ENVIAR OTP (REDEFINIÇÃO)",
            description: "Envia um código OTP para o email do usuário para redefinição de senha.",
            requests: ["email"],
            link: "/auth/send-reset-otp"
        },
        {
            title: "REDEFINIR SENHA",
            description: "Redefine a senha do usuário usando o email, o código OTP e a nova senha.",
            requests: ["email", "otp", "newPassword"],
            link: "/auth/reset-password"
        },
        {
            title: "VERIFICAR AUTENTICAÇÃO",
            description: "Verifica se o usuário está autenticado. Requer o token de autenticação nos cookies.",
            requests: ["(Requer token no cookie)"],
            link: "/auth/is-auth"
        }
    ];

    const projectsGrid = document.querySelector('.projects-grid');

    function createProjectCard(route) {
        const card = document.createElement('div');
        card.classList.add('project-card');

        const requestTags = route.requests.map(req => `<span class="tech-tag">${req}</span>`).join('');

        card.innerHTML = `
            <h3>${route.title}</h3>
            <p>${route.description}</p>
            <div class="tech-list">${requestTags}</div>
            <a href="${route.link}" target="_blank">${route.link}</a>
        `;
        
        return card;
    }

    apiRoutes.forEach(route => {
        projectsGrid.appendChild(createProjectCard(route));
    });
});