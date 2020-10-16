import styled from 'styled-components';
import css from '@styled-system/css';
export const LogoBox = styled.span(
  css({
    color: 'darkBold',
    fontSize: 26,
    fontWeight: 'bold',
    cursor: 'pointer',
    mr: [0, 20, 40],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform .3s cubic-bezier(.215,.61,.355,1)',
    "&:hover":{
      transform: 'scale(1.1)'
    }
  })
);

export const LogoImage = styled.img({
  display: 'block',
  backfaceVisibility: 'hidden',
  maxWidth: 48,
});
