import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    
    // Simulate API request
    setSubmitted(true);
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="w-full bg-srd-cream luxury-gold-pattern py-12 px-6 md:px-12 font-body relative">
      {/* Hanging marigold garland */}
      <div className="marigold-garland absolute top-0 left-0 right-0 z-30 pointer-events-none opacity-90"></div>

      <div className="max-w-7xl mx-auto">
        {/* Page title */}
        <div className="text-center mb-16">
          <span className="font-title italic text-srd-orange text-lg block mb-1">We would love to hear from you</span>
          <h2 className="font-title font-bold text-3xl md:text-5xl text-srd-maroon">Contact Shree Ram Dairy</h2>
          <div className="w-24 h-1 bg-srd-gold mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8 items-start">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 bg-gradient-to-br from-srd-maroon to-[#4a080f] text-white p-8 md:p-10 rounded-3xl shadow-xl border-2 border-srd-gold relative overflow-hidden">
            {/* Decorative floral circles */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-srd-gold/5 rounded-full pointer-events-none"></div>
            
            <h3 className="font-title font-bold text-2xl md:text-3xl text-srd-gold mb-6">Our Main Outlet</h3>
            <p className="text-sm opacity-80 leading-relaxed mb-8">
              Visit our flagship store in Ahmedabad, Gujarat to experience the fresh taste of traditional Gujarati sweets, farm-fresh milk products, and crispy farsans.
            </p>

            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-srd-gold/15 flex items-center justify-center text-srd-gold shrink-0 border border-srd-gold/20">
                  <MapPin size={20} />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-srd-gold uppercase tracking-wider">Address</h5>
                  <p className="text-sm text-gray-200 mt-1">
                    9/A Kangana Society, Opp. Amit Park Society, Vishalnagar, Isanpur, Ahmedabad - 382443
                  </p>
                </div>
              </div>

              {/* Call */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-srd-gold/15 flex items-center justify-center text-srd-gold shrink-0 border border-srd-gold/20">
                  <Phone size={20} />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-srd-gold uppercase tracking-wider">Call Us</h5>
                  <p className="text-sm text-gray-200 mt-1">📞 +91 75739 78055</p>
                  <p className="text-sm text-gray-200">Owner: Mahesh Nagar</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-srd-gold/15 flex items-center justify-center text-srd-gold shrink-0 border border-srd-gold/20">
                  <Mail size={20} />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-srd-gold uppercase tracking-wider">Email Address</h5>
                  <p className="text-sm text-gray-200 mt-1">maheshnagar@gmail.com</p>
                  <p className="text-sm text-gray-200">orders@shreeramdairy.com</p>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-srd-gold/15 flex items-center justify-center text-srd-gold shrink-0 border border-srd-gold/20">
                  <Clock size={20} />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-srd-gold uppercase tracking-wider">Store Timings</h5>
                  <p className="text-sm text-gray-200 mt-1">Monday - Sunday: 7:00 AM - 10:30 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form & Map */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-srd-gold/15 shadow-sm">
              <h3 className="font-title font-bold text-2xl text-srd-maroon mb-6">Send Us a Message</h3>

              {submitted ? (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center text-green-800 space-y-4">
                  <CheckCircle2 size={40} className="mx-auto text-green-500" />
                  <h4 className="font-title font-bold text-lg">Thank You!</h4>
                  <p className="text-sm leading-relaxed max-w-md mx-auto">
                    Your inquiry has been successfully submitted. Our team will get back to you shortly on your registered email address.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="bg-srd-gold text-srd-maroon hover:bg-srd-orange hover:text-white px-6 py-2 rounded-full font-bold text-xs shadow-md transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5" htmlFor="name">Your Name</label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-srd-gold focus:ring-1 focus:ring-srd-gold"
                        placeholder="Vanshal Patel"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5" htmlFor="email">Email Address</label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-srd-gold focus:ring-1 focus:ring-srd-gold"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5" htmlFor="phone">Phone Number (Optional)</label>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="block w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-srd-gold focus:ring-1 focus:ring-srd-gold"
                      placeholder="9876543210"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5" htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="block w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-srd-gold focus:ring-1 focus:ring-srd-gold"
                      placeholder="Tell us about catering inquiries, bulk festive ordering, or suggestions..."
                    ></textarea>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="bg-srd-gold hover:bg-srd-orange text-srd-maroon hover:text-white font-bold px-8 py-3 rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                  >
                    Send Message <Send size={16} />
                  </button>
                </form>
              )}
            </div>

            {/* Google Map Frame */}
            <div className="bg-white p-4 rounded-3xl border border-srd-gold/15 shadow-sm overflow-hidden aspect-[16/9] relative">
              <iframe 
                title="Shree Ram Dairy Location Map"
                src="https://maps.google.com/maps?q=shree%20ram%20dairy%2010%20Ranipur%20Rd%20Kangana%20Society%20Rajeswari%20Society%20Isanpur%20Ahmedabad%20Gujarat%20382443&t=&z=17&ie=UTF8&iwloc=&output=embed" 
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen="" 
                loading="lazy"
              ></iframe>
            </div>

          </div>
        </div>
      </div>
      {/* Hanging marigold garland above footer */}
      <div className="marigold-garland absolute bottom-0 left-0 right-0 z-30 pointer-events-none opacity-90"></div>
    </div>
  );
};

export default Contact;
