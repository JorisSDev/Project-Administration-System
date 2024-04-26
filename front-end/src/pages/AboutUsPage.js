import React from 'react';

function AboutUsPage() {
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>About Us</h1>
      <p style={styles.text}>
        Welcome to our project management tool, designed to help teams achieve their goals
        efficiently and effectively. Our platform offers a range of features tailored to enhance
        your project planning and execution capabilities.
      </p>
      <p style={styles.text}>
        Our mission is to provide cutting-edge solutions that empower project managers and
        team members alike. With our tool, you can track progress, manage resources, and
        maintain communication with ease.
      </p>
      <p style={styles.text}>
        Founded by a team of passionate developers and project managers, we understand the
        challenges you face and are here to support you every step of the way.
      </p>
      <p style={styles.text}>
        Thank you for choosing us to be part of your project management journey!
      </p>
    </div>
  );
}

// Styles object to keep JSX clean
const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center',
  },
  header: {
    fontSize: '24px',
    color: '#333',
  },
  text: {
    fontSize: '16px',
    color: '#666',
    textAlign: 'justify',
    marginTop: '20px',
  }
};

export default AboutUsPage;
