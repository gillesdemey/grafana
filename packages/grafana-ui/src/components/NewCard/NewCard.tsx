import React, { memo, cloneElement, FC, useMemo, useContext } from 'react';
import { css, cx } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { useStyles2 } from '../../themes';
import { CardContainer, CardContainerProps } from './NewCardContainer';
import { getFocusStyles } from '../../themes/mixins';

/**
 * @public
 */
export interface Props extends Omit<CardContainerProps, 'disableEvents' | 'disableHover'> {
  /** Indicates if the card and all its actions can be interacted with */
  disabled?: boolean;
  /** Link to redirect to on card click. If provided, the Card inner content will be rendered inside `a` */
  href?: string;
  /** On click handler for the Card */
  onClick?: () => void;
}

export interface CardInterface extends FC<Props> {
  Heading: typeof Heading;
  Tags: typeof Tags;
  Figure: typeof Figure;
  Meta: typeof Meta;
  Actions: typeof Actions;
  SecondaryActions: typeof SecondaryActions;
  Description: typeof Description;
}

const CardContext = React.createContext<{
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
} | null>(null);

/**
 * Generic card component
 *
 * @public
 */
export const Card: CardInterface = ({ disabled, href, onClick, children, ...htmlProps }) => {
  const hasHeadingComponent = useMemo(
    () =>
      React.Children.toArray(children).some(
        (c) => React.isValidElement(c) && (c.type as any).displayName === Heading.displayName
      ),
    [children]
  );

  const disableHover = disabled || (!onClick && !href);
  const onCardClick = onClick && !disabled ? onClick : undefined;

  return (
    <CardContainer disableEvents={disabled} disableHover={disableHover} {...htmlProps}>
      <CardContext.Provider value={{ href, onClick: onCardClick, disabled }}>
        {!hasHeadingComponent && <Heading />}
        {children}
      </CardContext.Provider>
    </CardContainer>
  );
};

interface ChildProps {
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

/** Main heading for the card */
const Heading = ({ children, className, 'aria-label': ariaLabel }: ChildProps & { 'aria-label'?: string }) => {
  const context = useContext(CardContext);
  const styles = useStyles2(getHeadingStyles);

  const { href, onClick } = context ?? { href: undefined, onClick: undefined };
  const Wrapper = href ? 'a' : onClick ? 'button' : React.Fragment;

  return (
    <h2 className={cx(styles.heading, className)}>
      <Wrapper href={href} onClick={onClick} className={styles.linkHack} aria-label={ariaLabel}>
        {children}
      </Wrapper>
    </h2>
  );
};
Heading.displayName = 'Heading';

const getHeadingStyles = (theme: GrafanaTheme2) => ({
  heading: css({
    gridArea: 'Heading',
    justifySelf: 'start',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 0,
    fontSize: theme.typography.size.md,
    letterSpacing: 'inherit',
    lineHeight: theme.typography.body.lineHeight,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeightMedium,
  }),
  linkHack: css({
    all: 'unset',
    '&::after': {
      position: 'absolute',
      content: '""',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      borderRadius: theme.shape.borderRadius(1),
    },

    '&:focus-visible': {
      outline: 'none',
      outlineOffset: 0,
      boxShadow: 'none',

      '&::after': {
        ...getFocusStyles(theme),
        zIndex: 1,
      },
    },
  }),
});

const Tags = ({ children, className }: ChildProps) => {
  const styles = useStyles2(getTagStyles);
  return <div className={cx(styles.tagList, className)}>{children}</div>;
};
Tags.displayName = 'Tags';

const getTagStyles = (theme: GrafanaTheme2) => ({
  tagList: css({
    position: 'relative',
    gridArea: 'Tags',
    alignSelf: 'center',
  }),
});

/** Card description text */
const Description = ({ children, className }: ChildProps) => {
  const styles = useStyles2(getDescriptionStyles);
  return <p className={cx(styles.description, className)}>{children}</p>;
};
Description.displayName = 'Description';

const getDescriptionStyles = (theme: GrafanaTheme2) => ({
  description: css({
    width: '100%',
    gridArea: 'Description',
    margin: theme.spacing(1, 0, 0),
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.body.lineHeight,
  }),
});

const Figure = ({ children, align = 'start', className }: ChildProps & { align?: 'start' | 'center' }) => {
  const styles = useStyles2(getFigureStyles);
  return (
    <div
      className={cx(
        styles.media,
        className,
        css`
          align-self: ${align};
        `
      )}
    >
      {children}
    </div>
  );
};
Figure.displayName = 'Figure';

const getFigureStyles = (theme: GrafanaTheme2) => ({
  media: css({
    position: 'relative',
    gridArea: 'Figure',

    marginRight: theme.spacing(2),
    width: '40px',

    '&:empty': {
      display: 'none',
    },
  }),
});

const Meta = memo(({ children, className, separator = '|' }: ChildProps & { separator?: string }) => {
  const styles = useStyles2(getMetaStyles);
  let meta = children;

  // Join meta data elements by separator
  if (Array.isArray(children) && separator) {
    const filtered = React.Children.toArray(children).filter(Boolean);
    if (!filtered.length) {
      return null;
    }
    meta = filtered.reduce((prev, curr, i) => [
      prev,
      <span key={`separator_${i}`} className={styles.separator}>
        {separator}
      </span>,
      curr,
    ]);
  }
  return <div className={cx(styles.metadata, className)}>{meta}</div>;
});
Meta.displayName = 'Meta';

const getMetaStyles = (theme: GrafanaTheme2) => ({
  metadata: css({
    gridArea: 'Meta',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    fontSize: theme.typography.size.sm,
    color: theme.colors.text.secondary,
    margin: theme.spacing(0.5, 0, 0),
    lineHeight: theme.typography.bodySmall.lineHeight,
    overflowWrap: 'anywhere',
  }),
  separator: css({
    margin: `0 ${theme.spacing(1)}`,
  }),
});

interface ActionsProps extends ChildProps {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const BaseActions = ({ children, disabled, variant, className }: ActionsProps) => {
  const styles = useStyles2(getActionStyles);
  const context = useContext(CardContext);
  const isDisabled = context?.disabled || disabled;

  const css = variant === 'primary' ? styles.actions : styles.secondaryActions;
  return (
    <div className={cx(css, className)}>
      {React.Children.map(children, (child) => {
        return React.isValidElement(child) ? cloneElement(child, { disabled: isDisabled, ...child.props }) : null;
      })}
    </div>
  );
};

const getActionStyles = (theme: GrafanaTheme2) => ({
  actions: css({
    gridArea: 'Actions',
    marginTop: theme.spacing(2),
    '& > *': {
      marginRight: theme.spacing(1),
    },
  }),
  secondaryActions: css({
    display: 'flex',
    gridArea: 'Secondary',
    alignSelf: 'center',
    color: theme.colors.text.secondary,
    marginTtop: theme.spacing(2),

    '& > *': {
      marginRight: `${theme.spacing(1)} !important`,
    },
  }),
});

const Actions = ({ children, disabled, className }: ChildProps) => {
  return (
    <BaseActions variant="primary" disabled={disabled} className={className}>
      {children}
    </BaseActions>
  );
};
Actions.displayName = 'Actions';

const SecondaryActions = ({ children, disabled, className }: ChildProps) => {
  return (
    <BaseActions variant="secondary" disabled={disabled} className={className}>
      {children}
    </BaseActions>
  );
};
SecondaryActions.displayName = 'SecondaryActions';

Card.Heading = Heading;
Card.Tags = Tags;
Card.Figure = Figure;
Card.Meta = Meta;
Card.Actions = Actions;
Card.SecondaryActions = SecondaryActions;
Card.Description = Description;