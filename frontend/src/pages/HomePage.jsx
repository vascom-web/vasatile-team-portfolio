import React, { useState, useEffect } from 'react';
import { Link } from '../App';
import API from '../services/api';
import SkillCard from '../components/SkillCard';

export default function HomePage() {
  const [members, setMembers] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersData, imagesData] = await Promise.all([
          API.getMembers(),
          API.getImages()
        ]);
        setMembers(membersData);
        setImages(imagesData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const heroImg = images.find(i => i.id === 'hero')?.url || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=400&fit=crop';
  const activeMembers = members.filter(m => m.active);
  const skills = API.getSkills();

  return (
    <div className="pt-16 dark:bg-gray-900 transition-colors">
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <img
          src={heroImg}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-20 dark:opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 dark:from-indigo-950/50 dark:to-purple-950/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl fade-in">
            <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold tracking-wide mb-4">
              🚀 Team Portfolio
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
              Hire the <span className="gradient-text">best team</span> for your next project
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Browse our skilled professionals across technical writing, web development, app development,
              video editing, and graphics design. Pick the right expert for your job.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/skills"
                className="px-6 py-3 bg-gradient-primary text-white rounded-xl font-semibold hover:shadow-lg transition shadow-md"
              >
                Explore Skills
              </Link>
              <Link
                to="/members"
                className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl font-semibold border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500 transition"
              >
                View Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white dark:bg-gray-800 border-y border-gray-100 dark:border-gray-700 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{members.length}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Members</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{activeMembers.length}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Active</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{skills.length}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Skills</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">24/7</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Support</div>
          </div>
        </div>
      </section>

      {/* Skills Preview */}
      <section className="py-16 bg-gradient-soft dark:bg-gray-800/50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Our Expertise</h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mt-2 mb-10">
            Choose from a wide range of professional skills
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {skills.map((s) => {
              const count = members.filter((m) => m.skill === s.id && m.active).length;
              return <SkillCard key={s.id} skill={s} memberCount={count} />;
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-900 dark:bg-gray-950 text-white">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold">Ready to get started?</h2>
          <p className="mt-3 text-gray-300 dark:text-gray-400">
            Browse our team members and hire the perfect expert for your project today.
          </p>
          <Link
            to="/members"
            className="inline-block mt-6 px-8 py-3 bg-gradient-primary rounded-xl font-semibold hover:shadow-xl transition shadow-lg"
          >
            View Team Members
          </Link>
        </div>
      </section>
    </div>
  );
}