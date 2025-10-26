import React from 'react';

const styles = {
  container: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    boxSizing: 'border-box',
  }
};

function Layout({ children }) {
  return (
    <main style={styles.container}>
      {children}
    </main>
  );
}

export default Layout;