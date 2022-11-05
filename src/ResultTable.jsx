import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import StarRate from '@material-ui/icons/StarRateRounded';
import ArrowForwardRounded from '@material-ui/icons/ArrowForwardRounded';
import { connect } from 'react-redux';

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5,
  },
});

class TablePaginationActions extends React.Component {
  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, 0);
  };

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1);
  };

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1);
  };

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
    );
  };

  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props;

    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  }
}

TablePaginationActions.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired,
};

const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
  TablePaginationActions,
);
let counter = 0;
// eslint-disable-next-line
function createData(name, calories, fat) {
  counter += 1;
  return { id: counter, name, calories, fat };
}

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 500,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

type Props = {
  rowsPerPage: Number,
  page: Number,
  data: Object,
  handleChangePage: Function,
  handleChangeRowsPerPage: Function
}

class ResultTable extends React.Component<Props> {
  render() {
    const data = this.props.data.items;
    const { classes } = this.props;
    const emptyRows = this.props.rowsPerPage - Math.min(this.props.rowsPerPage, data.length - this.props.page * this.props.rowsPerPage);
    return (
      <Paper className={classes.root}>
        {
          data.length !== 0 ?
          <div className={classes.tableWrapper}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Full Name & Description</TableCell>
                  <TableCell>Language</TableCell>
                  <TableCell>Stars Count</TableCell>
                  <TableCell>Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.slice(this.props.page * this.props.rowsPerPage, this.props.page * this.props.rowsPerPage + this.props.rowsPerPage).map(row => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Typography variant="h6">{row.full_name}</Typography>
                      <Typography>{row.description.substr(0, 60).concat('...')}</Typography>
                    </TableCell>
                    <TableCell>{row.language}</TableCell>
                    <TableCell>
                      <div style={{display: "flex"}}>
                        <StarRate style={{color: "#fdcb6e"}}/>
                        {row.stargazers_count}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button href={row.html_url} target="_blank"> 
                        <ArrowForwardRounded />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 48 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[10, 20, 30]}
                    colSpan={10}
                    count={data.length}
                    value={this.props.rowsPerPage}
                    rowsPerPage={this.props.rowsPerPage}
                    page={this.props.page}
                    SelectProps={{
                      native: true,
                    }}
                    onChangePage={(e, page) => this.props.handleChangePage(e, page)}
                    onChangeRowsPerPage={(e) => this.props.handleChangeRowsPerPage(e.target.value)}
                    ActionsComponent={TablePaginationActionsWrapped}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </div>
          :
          <Typography>Requested search do not return any data</Typography>
        }
      </Paper>
    );
  }
}

ResultTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

const MapStateToProps = (state: State) => ({
  data: state.homepage.data,
  page: state.homepage.page,
  rowsPerPage: state.homepage.rowsPerPage
})

const MapDispatchToProps = (dispatch: Dispatch) => ({
  onNameChange: (name) => dispatch({type: "HANDLE_NAME_CHANGE", payload: name}),
  handleChangePage: (e, page) => dispatch({type: "HANDLE_CHANGE_PAGE", payload: {e, page}}),
  handleChangeRowsPerPage: (e) => dispatch({type: "HANDLE_CHANGE_ROWS_PAGE", payload: e})
})

export default connect(MapStateToProps, MapDispatchToProps)(withStyles(styles)(ResultTable));
