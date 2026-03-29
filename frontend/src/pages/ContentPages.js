import React from 'react';
import { Link } from 'react-router-dom';

export const Careers = () => (
  <div className="max-w-4xl mx-auto px-4 py-16">
    <h1 className="text-4xl font-bold text-gray-900 mb-6 font-serif text-warmOrange">Careers at Hungry</h1>
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-peach-50 text-gray-700 space-y-4">
      <p className="text-lg">Join us in our mission to bring the best food delivery experience to everyone. We're a fast-growing, passionate team.</p>
      
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Open Positions</h2>
      
      <div className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
        <h3 className="text-xl font-bold text-gray-900">Frontend Engineer (React)</h3>
        <p className="text-gray-500 mb-3">Remote / Full-time</p>
        <p>Help us build beautiful, performant user interfaces using React and Tailwind CSS.</p>
        <button className="mt-3 text-warmOrange font-bold hover:underline">Apply Now &rarr;</button>
      </div>
      
      <div className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow mt-4">
        <h3 className="text-xl font-bold text-gray-900">Delivery Partner</h3>
        <p className="text-gray-500 mb-3">Multiple Locations / Flexible</p>
        <p>Become a delivery partner and earn on your schedule. Flexible hours and great incentives.</p>
        <button className="mt-3 text-warmOrange font-bold hover:underline">Apply Now &rarr;</button>
      </div>
    </div>
  </div>
);

export const Blog = () => (
  <div className="max-w-4xl mx-auto px-4 py-16">
    <h1 className="text-4xl font-bold text-gray-900 mb-6 font-serif text-warmOrange">Hungry Blog</h1>
    <div className="grid gap-8">
      <article className="bg-white p-6 rounded-3xl shadow-sm border border-peach-50">
        <span className="text-sm font-bold text-warmOrange tracking-wider uppercase mb-2 block">Food Tech</span>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">How we guarantee 30-minute delivery</h2>
        <p className="text-gray-600 mb-4">Behind the scenes look at our routing algorithms and logistics that make ultra-fast food delivery possible.</p>
        <button className="text-warmOrange font-medium hover:underline">Read Article</button>
      </article>
      <article className="bg-white p-6 rounded-3xl shadow-sm border border-peach-50">
        <span className="text-sm font-bold text-warmOrange tracking-wider uppercase mb-2 block">Cuisine Focus</span>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Top 10 Pizzas to try this Summer</h2>
        <p className="text-gray-600 mb-4">A curated list of our most popular and beloved pizza options across all our restaurant partners.</p>
        <button className="text-warmOrange font-medium hover:underline">Read Article</button>
      </article>
    </div>
  </div>
);

export const Partner = () => (
  <div className="max-w-4xl mx-auto px-4 py-16 text-center">
    <h1 className="text-4xl font-bold text-gray-900 mb-6 font-serif text-warmOrange">Partner With Us</h1>
    <div className="bg-peach-50 p-10 rounded-3xl">
      <h2 className="text-2xl font-bold mb-4">Grow your restaurant business</h2>
      <p className="text-gray-700 mb-8 max-w-2xl mx-auto text-lg hover:">Join thousands of restaurants who use Hungry to increase their customer base and delivery volume.</p>
      <Link to="/partner-onboarding" className="inline-block bg-warmOrange hover:bg-peach-500 text-white font-bold py-3 px-8 rounded-full shadow-md transform hover:-translate-y-1 transition-all">
        Register Your Restaurant
      </Link>
    </div>
  </div>
);

export const FAQ = () => (
  <div className="max-w-4xl mx-auto px-4 py-16">
    <h1 className="text-4xl font-bold text-gray-900 mb-8 font-serif text-warmOrange text-center">Frequently Asked Questions</h1>
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-lg text-gray-900 mb-2">How fast is delivery?</h3>
        <p className="text-gray-600">We aim to deliver all orders within 30-45 minutes depending on distance and restaurant preparation time.</p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-lg text-gray-900 mb-2">How can I track my order?</h3>
        <p className="text-gray-600">Once your order is placed, you will be redirected to an order tracking page with live status updates.</p>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-lg text-gray-900 mb-2">Is the food pure vegetarian?</h3>
        <p className="text-gray-600">Yes! Hungry is a 100% pure vegetarian food delivery platform. We exclusively partner with pure veg restaurants to ensure the highest standards for our customers.</p>
      </div>
    </div>
  </div>
);

export const Refunds = () => (
  <div className="max-w-4xl mx-auto px-4 py-16">
    <h1 className="text-4xl font-bold text-gray-900 mb-6 font-serif text-warmOrange">Cancellations & Refunds</h1>
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-peach-50 prose max-w-none text-gray-700">
      <p>We want you to be completely satisfied with your order. Please read our cancellation and refund policies below.</p>
      <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">Cancellations</h3>
      <p>Orders can only be cancelled within 1 minute of placing them because restaurants start preparing food immediately. To cancel, go to your active orders on the dashboard.</p>
      <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">Refunds</h3>
      <p>If there is an issue with your food (missing item, wrong order, quality issue), please contact support within 12 hours. We will investigate and issue a partial or full refund to your original payment method or as Hungry Credits, depending on the situation.</p>
    </div>
  </div>
);

export const Terms = () => (
  <div className="max-w-4xl mx-auto px-4 py-16">
    <h1 className="text-4xl font-bold text-gray-900 mb-6 font-serif text-warmOrange">Terms of Service</h1>
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-gray-700 space-y-4 text-sm leading-relaxed">
      <p><strong>Last Updated: October 2023</strong></p>
      <h2 className="text-xl font-bold text-gray-900 mt-6">1. Acceptance of Terms</h2>
      <p>By accessing and using Hungry, you accept and agree to be bound by the terms and provision of this agreement.</p>
      
      <h2 className="text-xl font-bold text-gray-900 mt-6">2. User Accounts</h2>
      <p>To use most features of our service, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials.</p>
      
      <h2 className="text-xl font-bold text-gray-900 mt-6">3. Ordering and Payment</h2>
      <p>All prices are listed in INR (₹). Delivery fees and taxes may apply and will be displayed at checkout. We reserve the right to refuse service, terminate accounts, or cancel orders at our sole discretion.</p>
      
      <h2 className="text-xl font-bold text-gray-900 mt-6">4. Intellectual Property</h2>
      <p>The Service and its original content, features, and functionality are owned by Hungry and are protected by international copyright, trademark, and other intellectual property laws.</p>
    </div>
  </div>
);

export const Privacy = () => (
  <div className="max-w-4xl mx-auto px-4 py-16">
    <h1 className="text-4xl font-bold text-gray-900 mb-6 font-serif text-warmOrange">Privacy Policy</h1>
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-gray-700 space-y-4 text-sm leading-relaxed">
      <p><strong>Last Updated: October 2023</strong></p>
      <h2 className="text-xl font-bold text-gray-900 mt-6">1. Information We Collect</h2>
      <p>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This info may include: name, email, phone number, delivery address, and payment method.</p>
      
      <h2 className="text-xl font-bold text-gray-900 mt-6">2. Use of Information</h2>
      <p>We use the information we collect about you to:</p>
      <ul className="list-disc pl-5 mt-2 space-y-1">
        <li>Provide, maintain, and improve our Services</li>
        <li>Process and facilitate transactions and payments</li>
        <li>Send transactional messages (receipts, updates)</li>
        <li>Respond to your comments, questions, and requests</li>
      </ul>
      
      <h2 className="text-xl font-bold text-gray-900 mt-6">3. Sharing Information</h2>
      <p>We may share the information we collect about you as described in this policy, such as with our restaurant partners (your order details and first name) and delivery drivers (your delivery address and phone number).</p>
    </div>
  </div>
);
