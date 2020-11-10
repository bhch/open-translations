export function TopNav() {
    return (
        <div className="nav top-nav">
            <div className="container">
                <a href=" " className="branding">
                    <img src={process.env.PUBLIC_URL + "/logo-128.png"} alt="Logo" />
                    Open Translations
                    <span className="label beta">Beta</span>
                </a>

                <ul>
                    <li><a href="#about">About</a></li>
                    <li><a href="https://github.com/bhch/open-translations">GitHub</a></li>
                </ul>
            </div>
        </div>
    );
}
