import React, { createContext } from 'react';
import PropTypes from 'prop-types';
import useRim from '../hooks/useRim';

interface ContextI {
 //correct rim type; couldn't export UseRimI from ../hooks/useRim
 //because of a typescript error
  rim: any;
}
const Context = createContext<ContextI | null>(null);

const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  const rim = useRim();

  return (
    <Context.Provider
      value={{
        rim,
      }}
    >
      {children}
    </Context.Provider>
  );
};

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Context;

export { ContextProvider };

