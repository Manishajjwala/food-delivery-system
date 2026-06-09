import React from 'react';
import { Link } from 'react-router-dom';

export const Careers = () => (
  <div className="max-w-4xl mx-auto px-4 py-16">
    <h1 className="text-4xl font-bold text-gray-900 mb-6 font-serif text-warmOrange">Jobs at Hungry</h1>
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-peach-50 text-gray-700 space-y-4">
      <p className="text-lg">Join us and help us grow. We are a fast and friendly team.</p>
      
      <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Open Jobs</h2>
      
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

export const Blog = () => {
  const [subscribed, setSubscribed] = React.useState(false);
  const [expandedStory, setExpandedStory] = React.useState(null);

  const handleJoin = (e) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
  };

  const handleReadStory = () => {
    alert("Full story is coming soon! We are writing these stories for you.");
  };

  const stories = [
    {
      id: 1,
      tag: 'Cooking Secrets',
      title: 'Our Secret to 100% Freshness',
      excerpt: 'Learn how we get fresh food every day to make sure your meal is tasty and healthy.',
      fullContent: 'At Hungry, we believe that good food needs fresh items. Every morning at 5 AM, our team goes to local markets to get fresh vegetables and milk. We don’t use old stock – if it’s not fresh from today, we don’t use it. Our 100% veg promise means everything we use is checked for quality.'
    },
    {
      id: 2,
      tag: 'Community',
      title: 'Supporting Our Local Chefs',
      excerpt: 'Read about our local restaurant partners who cook tasty food for you.',
      fullContent: 'We work with local home kitchens and small restaurants that have been cooking for a long time. By helping them with delivery and our app, we help these local chefs find more customers. When you order from Hungry, you are also helping these local businesses grow.'
    }
  ];

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-10 md:py-16">
        <div className="bg-gradient-to-br from-warmOrange to-orange-600 rounded-[3rem] p-12 md:p-16 text-center mb-16 shadow-xl shadow-warmOrange/20 relative overflow-hidden">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 font-serif relative z-10">Hungry Stories</h1>
        <p className="text-orange-50 text-lg md:text-xl max-w-2xl mx-auto italic relative z-10">Stories from our kitchen to your doorstep. Pure veg and always fresh.</p>
        <div className="w-24 h-1.5 bg-white/40 mx-auto mt-8 rounded-full relative z-10"></div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {stories.map((story) => (
          <article 
            key={story.id}
            onClick={() => setExpandedStory(expandedStory === story.id ? null : story.id)} 
            className={`group bg-white p-8 rounded-[2rem] border transition-all duration-500 cursor-pointer ${expandedStory === story.id ? 'border-warmOrange shadow-2xl scale-[1.02]' : 'border-peach-50 shadow-sm hover:shadow-xl hover:border-warmOrange/20'}`}
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-warmOrange bg-warmOrange/10 px-3 py-1 rounded-lg mb-4 inline-block">{story.tag}</span>
            <h2 className="text-2xl font-black text-gray-900 mb-4 group-hover:text-warmOrange transition-colors">{story.title}</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              {expandedStory === story.id ? story.fullContent : story.excerpt}
            </p>
            <button className="text-warmOrange font-bold flex items-center gap-2 transition-transform">
              {expandedStory === story.id ? 'Close Story' : 'Read Full Story'} &rarr;
            </button>
          </article>
        ))}
      </div>

      <div className="mt-20 bg-gradient-to-br from-peach-50 to-orange-50 p-12 rounded-[3rem] text-center border border-peach-200 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-3xl font-black text-gray-900 mb-4 font-serif">Never miss a flavor!</h3>
          <p className="text-gray-600 text-md mb-8 max-w-md mx-auto">Subscribe to our newsletter for exclusive offers, fresh stories, and new dish alerts straight to your inbox.</p>
          <form onSubmit={handleJoin} className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
            <input required type="email" placeholder="Your Email Address" className="flex-1 px-6 py-4 rounded-full border-2 border-white focus:outline-none focus:border-warmOrange focus:ring-4 focus:ring-warmOrange/10 shadow-sm text-sm" />
            <button type="submit" className={`px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest shadow-lg transition-all ${subscribed ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-warmOrange text-white shadow-warmOrange/30 hover:shadow-warmOrange/50 hover:bg-orange-600 hover:-translate-y-1'}`}>
              {subscribed ? 'Subscribed!' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
};

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
