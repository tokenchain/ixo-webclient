import React from 'react'

const ServiceProviders = (props): JSX.Element => {
  return (
    <svg
      width={props.width || 18}
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 6a1.4 1.4 0 010 2.8 1.45 1.45 0 01-1.4-1.5A1.29 1.29 0 0114 6zm0 3.5a2.2 2.2 0 10-2.2-2.2A2.22 2.22 0 0014 9.5zm-1.4.9c.2.2.3.4.5.5a3.59 3.59 0 011.1-.2 2.65 2.65 0 012.6 2.6v.5h.7v-.5a3.33 3.33 0 00-3.3-3.3 4.19 4.19 0 00-1.6.4zm.1 3.4h.8a4.27 4.27 0 00-4.3-4.3 4.35 4.35 0 00-4.4 4.3h.7a3.6 3.6 0 117.2 0zm-3.8-9a1.79 1.79 0 011.8 1.8 1.77 1.77 0 01-1.8 1.7 1.86 1.86 0 01-1.8-1.8 1.71 1.71 0 011.8-1.7zm0 4.2a2.43 2.43 0 002.4-2.4 2.52 2.52 0 00-2.4-2.5 2.52 2.52 0 00-2.5 2.4A2.54 2.54 0 008.9 9zm-7.7 4.8v-.5a2.65 2.65 0 012.6-2.6 4.25 4.25 0 011.1.2 1.21 1.21 0 01.5-.5 4.19 4.19 0 00-1.5-.4 3.37 3.37 0 00-3.4 3.4v.5l.7-.1zM3.7 6a1.37 1.37 0 011.4 1.4 1.29 1.29 0 01-1.4 1.3 1.29 1.29 0 01-1.3-1.4A1.26 1.26 0 013.7 6zm0 3.5a2.2 2.2 0 000-4.4 2.14 2.14 0 00-2.1 2.2 2.14 2.14 0 002.1 2.2z"
        fill={props.fill || '#fff'}
      />
    </svg>
  )
}

export default ServiceProviders
