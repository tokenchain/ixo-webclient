import React from 'react'

const Projects = (props): JSX.Element => {
  return (
    <svg
      width={props.width || 36}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 18 18"
    >
      <path
        fill={props.fill || '#fff'}
        d="M16.33,13.1l0,0,0,0,0,0V5.09h0a.28.28,0,0,0,0-.09h0l0-.07v0h0l0-.06h0a.18.18,0,0,0-.07,0h0L9.2.68h0a.42.42,0,0,0-.38,0l-7,4.09h0a.37.37,0,0,0-.18.32v7.78h0a.39.39,0,0,0,.18.33l7,4.13a.41.41,0,0,0,.19.05l.11,0,.09,0h0l7-4.12,0,0h0Zm-3.1-2.21a4.65,4.65,0,0,0,0-3.82l2.43-1.34v6.5l-2.33-1.29ZM4.79,7.08A4.64,4.64,0,0,0,4.38,9a4.72,4.72,0,0,0,.4,1.9L2.34,12.23V5.73l1,.55ZM14,5.81l-1.1.6a4.64,4.64,0,0,0-3.47-2V1.66l5.88,3.42ZM8.63,1.65V4.36A4.67,4.67,0,0,0,5.15,6.42L2.73,5.08ZM5.15,11.54A4.65,4.65,0,0,0,8.63,13.6v2.75L2.72,12.88Zm4.24,4.8V13.6a4.63,4.63,0,0,0,3.48-2l2.41,1.33Z"
      />
    </svg>
  )
}

export default Projects
