import { useState } from 'react'

// Project type
interface Project {
    id: string
    name: string
    repo: string
    status: 'online' | 'building' | 'failed'
    framework: string
    lastDeployed: string
    visits: number
}

// Sample projects data
const initialProjects: Project[] = [
    {
        id: '1',
        name: 'main-portfolio',
        repo: 'github.com/user/portfolio',
        status: 'online',
        framework: 'Next.js',
        lastDeployed: '2 hours ago',
        visits: 15420
    },
    {
        id: '2',
        name: 'saas-dashboard',
        repo: 'github.com/user/saas-app',
        status: 'online',
        framework: 'React',
        lastDeployed: '5 hours ago',
        visits: 8230
    },
    {
        id: '3',
        name: 'api-backend',
        repo: 'github.com/user/api',
        status: 'building',
        framework: 'Node.js',
        lastDeployed: 'Building...',
        visits: 45600
    }
]

// Activity data
const activities = [
    { id: 1, type: 'deploy', title: 'Deployed main-portfolio', meta: 'Production • v2.4.1', time: '2 hours ago' },
    { id: 2, type: 'build', title: 'Build completed for saas-dashboard', meta: '45 seconds • 1.2MB', time: '5 hours ago' },
    { id: 3, type: 'deploy', title: 'Deployed api-backend', meta: 'Staging • v1.8.0', time: '1 day ago' },
]

// Icons
const FolderIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
)

const RocketIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
)

const ChartIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
)

const SettingsIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
)

const ServerIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
    </svg>
)

const CheckIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
)

function App() {
    const [activeTab, setActiveTab] = useState('projects')
    const [projects] = useState<Project[]>(initialProjects)

    const navItems = [
        { id: 'projects', label: 'Projects', icon: <FolderIcon /> },
        { id: 'deployments', label: 'Deployments', icon: <RocketIcon /> },
        { id: 'analytics', label: 'Analytics', icon: <ChartIcon /> },
        { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
    ]

    return (
        <div className="app">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="logo-container">
                    <div className="logo-icon">
                        <ServerIcon />
                    </div>
                    <span className="logo-text">NovaDeploy</span>
                </div>

                <nav className="nav-menu">
                    {navItems.map(item => (
                        <button
                            key={item.id}
                            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(item.id)}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <div className="page-header">
                    <h1 className="page-title">Infrastructure Overview</h1>
                    <p className="page-subtitle">Manage your cloud deployments across 24 edge locations</p>
                </div>

                {/* Stats */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-label">Total Projects</div>
                        <div className="stat-value">{projects.length}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Active Deployments</div>
                        <div className="stat-value success">{projects.filter(p => p.status === 'online').length}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Total Visits (24h)</div>
                        <div className="stat-value">{(projects.reduce((a, p) => a + p.visits, 0) / 1000).toFixed(1)}K</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-label">Uptime</div>
                        <div className="stat-value success">99.98%</div>
                    </div>
                </div>

                {/* Projects */}
                <div className="projects-header">
                    <h2 className="section-title">Your Projects</h2>
                    <button className="btn-primary">+ New Project</button>
                </div>

                <div className="projects-grid">
                    {projects.map(project => (
                        <div key={project.id} className="project-card">
                            <div className="project-header">
                                <div className="project-icon">
                                    <img
                                        src={`https://api.dicebear.com/7.x/shapes/svg?seed=${project.name}`}
                                        alt={project.name}
                                    />
                                </div>
                                <div className={`status-badge ${project.status}`}>
                                    <span className="status-dot"></span>
                                    {project.status}
                                </div>
                            </div>
                            <h3 className="project-name">{project.name}</h3>
                            <p className="project-repo">{project.repo}</p>
                            <div className="project-stats">
                                <div>
                                    <div className="project-stat-label">Framework</div>
                                    <div className="project-stat-value">{project.framework}</div>
                                </div>
                                <div>
                                    <div className="project-stat-label">Last Deploy</div>
                                    <div className="project-stat-value">{project.lastDeployed}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Activity */}
                <div className="activity-section">
                    <h2 className="section-title" style={{ marginBottom: '16px' }}>Recent Activity</h2>
                    <div className="activity-list">
                        {activities.map(activity => (
                            <div key={activity.id} className="activity-item">
                                <div className={`activity-icon ${activity.type}`}>
                                    {activity.type === 'deploy' ? <CheckIcon /> : <RocketIcon />}
                                </div>
                                <div className="activity-content">
                                    <div className="activity-title">{activity.title}</div>
                                    <div className="activity-meta">{activity.meta}</div>
                                </div>
                                <div className="activity-time">{activity.time}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default App
