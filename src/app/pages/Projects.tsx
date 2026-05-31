import { useState } from 'react';
import { Link } from 'react-router';
import { Search, Filter, DollarSign, Clock, User } from 'lucide-react';
import { mockProjects } from '../data/mockData';
import type { Project } from '../types';

const categories = ['All', 'Web Development', 'Graphic Design', 'UI/UX Design', 'Data Science', 'Content Writing', 'Marketing'];

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [budgetType, setBudgetType] = useState<'all' | 'fixed' | 'hourly'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'budget' | 'applications'>('newest');
  const [difficulty, setDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [beginnerFriendly, setBeginnerFriendly] = useState(false);
  const [budgetRange, setBudgetRange] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  const filteredProjects = mockProjects
    .filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.skillsRequired.some((skill) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === 'All' || project.category === selectedCategory;

      const matchesBudgetType =
        budgetType === 'all' || project.budgetType === budgetType;

      const matchesDifficulty =
        difficulty === 'all' || project.difficulty === difficulty;

      const matchesBeginnerFriendly =
        !beginnerFriendly || project.isBeginnerFriendly === true;

      const matchesBudgetRange =
        budgetRange === 'all' ||
        (budgetRange === 'low' && project.budget < 300) ||
        (budgetRange === 'medium' && project.budget >= 300 && project.budget < 800) ||
        (budgetRange === 'high' && project.budget >= 800);

      return matchesSearch && matchesCategory && matchesBudgetType && matchesDifficulty && matchesBeginnerFriendly && matchesBudgetRange;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
      } else if (sortBy === 'budget') {
        return b.budget - a.budget;
      } else {
        return b.applicationsCount - a.applicationsCount;
      }
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Projects</h1>
        <p className="text-gray-600">
          Find opportunities that match your skills and interests
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
            />
          </div>

          <select
            value={budgetType}
            onChange={(e) => setBudgetType(e.target.value as 'all' | 'fixed' | 'hourly')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
          >
            <option value="all">All Budget Types</option>
            <option value="fixed">Fixed Price</option>
            <option value="hourly">Hourly Rate</option>
          </select>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as 'all' | 'beginner' | 'intermediate' | 'advanced')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
          >
            <option value="all">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <select
            value={budgetRange}
            onChange={(e) => setBudgetRange(e.target.value as 'all' | 'low' | 'medium' | 'high')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
          >
            <option value="all">All Budgets</option>
            <option value="low">Under $300</option>
            <option value="medium">$300 - $800</option>
            <option value="high">$800+</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'budget' | 'applications')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="budget">Highest Budget</option>
            <option value="applications">Most Applications</option>
          </select>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <input
            type="checkbox"
            id="beginnerFriendly"
            checked={beginnerFriendly}
            onChange={(e) => setBeginnerFriendly(e.target.checked)}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-600"
          />
          <label htmlFor="beginnerFriendly" className="text-sm text-gray-700">
            Show only beginner-friendly projects
          </label>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-gray-600">
          {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} found
        </p>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}

        {filteredProjects.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Filter className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No projects found matching your criteria</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setBudgetType('all');
              }}
              className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      to={`/projects/${project.id}`}
      className="block bg-white rounded-lg shadow hover:shadow-lg transition p-6"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-1">{project.title}</h3>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{project.customerName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{new Date(project.postedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <span
          className={`px-3 py-1 text-sm rounded-full ${
            project.status === 'open'
              ? 'bg-green-100 text-green-700'
              : project.status === 'in_progress'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {project.status.replace('_', ' ')}
        </span>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-2">{project.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {project.skillsRequired.map((skill) => (
          <span
            key={skill}
            className="px-2 py-1 bg-indigo-50 text-indigo-700 text-sm rounded"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-1 text-lg font-semibold text-gray-900">
          <DollarSign className="w-5 h-5" />
          <span>
            {project.budget} {project.budgetType === 'hourly' ? '/hr' : 'fixed'}
          </span>
        </div>
        <div className="text-sm text-gray-600">
          <span className="font-medium">{project.applicationsCount}</span> applications
        </div>
        <div className="text-sm text-gray-600">
          Duration: <span className="font-medium">{project.duration}</span>
        </div>
      </div>
    </Link>
  );
}
