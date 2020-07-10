// This is a bi-directional infinite scroller.
// As the beginning & end are reached, the dates are recalculated and the current
// index adjusted to match the previous visible date.
// RecyclerListView helps to efficiently recycle instances, but the data that
// it's fed is finite. Hence the data must be shifted at the ends to appear as
// an infinite scroller.

import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview';
import moment from 'moment';

export default class CalendarScroller extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    initialRenderIndex: PropTypes.number,
    renderMonth: PropTypes.func,
    renderMonthParams: PropTypes.object.isRequired,
    minDate: PropTypes.any,
    maxDate: PropTypes.any,
    maxSimultaneousMonths: PropTypes.number,
    horizontal: PropTypes.bool,
    updateMonthYear: PropTypes.func,
    onMonthChange: PropTypes.func,
  }

  static defaultProps = {
    data: [],
    renderMonthParams: { styles: {} },
  };

  constructor(props) {
    super(props);

    this.updateLayout = dims => {
      const itemWidth = dims.containerWidth;
      let itemHeight = dims.containerHeight;
      if (dims.dayWrapper && dims.dayWrapper.height) {
        itemHeight = dims.dayWrapper.height * 6; // max 6 row weeks per month
      }

      const layoutProvider = new LayoutProvider(
        () => 0, // only 1 view type
        (type, dim) => {
          dim.width = itemWidth;
          dim.height = itemHeight;
        }
      );

      return { layoutProvider, itemHeight, itemWidth };
    };

    this.dataProvider = new DataProvider((r1, r2) => {
      return r1 !== r2;
    });

    this.updateMonthsData = data => {
      return {
        data,
        numMonths: data.length,
        dataProvider: this.dataProvider.cloneWithRows(data),
      };
    };

    this.state = {
      ...this.updateLayout(props.renderMonthParams.styles),
      ...this.updateMonthsData(props.data),
      numVisibleItems: 1, // updated in onLayout
    };
  }

  shouldComponentUpdate(prevProps, prevState) {
    return this.state.data !== prevState.data ||
      this.state.itemHeight !== prevState.itemHeight ||
      this.state.itemWidth !== prevState.itemWidth ||
      this.props.renderMonthParams !== prevProps.renderMonthParams;
  }

  componentDidUpdate(prevProps) {
    let newState = {};
    let updateState = false;

    if (this.props.renderMonthParams.styles !== prevProps.renderMonthParams.styles) {
      updateState = true;
      newState = this.updateLayout(this.props.renderMonthParams);
    }

    if (this.props.data !== prevProps.data) {
      updateState = true;
      newState = {...newState, ...this.updateMonthsData(this.props.data)};
    }

    if (updateState) {
      this.setState(newState);
    }
  }

  // Scroll left, guarding against start index.
  scrollLeft = () => {
    const { currentIndex, numVisibleItems } = this.state;
    if (currentIndex === 0) {
      return;
    }
    const newIndex = Math.max(currentIndex - numVisibleItems, 0);
    this.rlv && this.rlv.scrollToIndex(newIndex, true);
  }

  // Scroll right, guarding against end index.
  scrollRight = () => {
    const { currentIndex, numVisibleItems, numMonths } = this.state;
    const newIndex = Math.min(currentIndex + numVisibleItems, numMonths - 1);
    this.rlv && this.rlv.scrollToIndex(newIndex, true);
  }

  // Shift dates when end of list is reached.
  shiftMonthsForward = currentMonth => {
    this.shiftMonths(currentMonth, this.state.numMonths / 3);
  }

  // Shift dates when beginning of list is reached.
  shiftMonthsBackward = currentMonth => {
    this.shiftMonths(currentMonth, this.state.numMonths * 2/3);
  }

  // Go to specified month & year.
  goToMonthYear = ({month, year}) => {
    // Go to existing month if possible
    const { data, numMonths } = this.state;
    const monthYear = moment({month, year, hour: 12});
    for (let i = 0; i < numMonths; i++) {
      if (data[i].isSame(monthYear, 'month')) {
        this.rlv && this.rlv.scrollToIndex(i, false);
        return;
      }
    }
    // Create new months
    this.shiftMonths(monthYear, numMonths / 2);
  }

  shiftMonths = (currentMonth, offset) => {
    const prevVisMonth = currentMonth.clone();
    const newStartMonth = prevVisMonth.clone().subtract(Math.floor(offset), 'months');
    this.updateMonths(prevVisMonth, newStartMonth);
  }

  updateMonths = (prevVisMonth, newStartMonth) => {
    if (this.shifting) {
      return;
    }
    const {
      minDate,
      maxDate,
      restrictMonthNavigation,
    } = this.props;
    const data = [];
    let _newStartMonth = newStartMonth;
    if (minDate && restrictMonthNavigation && newStartMonth.isBefore(minDate, 'month')) {
      _newStartMonth = moment(minDate);
    }
    for (let i = 0; i < this.state.numMonths; i++) {
      let date = _newStartMonth.clone().add(i, 'months');
      if (maxDate && restrictMonthNavigation && date.isAfter(maxDate, 'month')) {
        break;
      }
      data.push(date);
    }
    // Prevent reducing range when the minDate - maxDate range is small.
    if (data.length < this.props.maxSimultaneousMonths) {
      return;
    }

    // Scroll to previous date
    for (let i = 0; i < data.length; i++) {
      if (data[i].isSame(prevVisMonth, 'month')) {
        this.shifting = true;
        this.rlv && this.rlv.scrollToIndex(i, false);
        // RecyclerListView sometimes returns position to old index after
        // moving to the new one. Set position again after delay.
        setTimeout(() => {
          this.rlv && this.rlv.scrollToIndex(i, false);
          this.shifting = false; // debounce
        }, 800);
        break;
      }
    }
    this.setState({
      data,
      dataProvider: this.dataProvider.cloneWithRows(data),
    });
  }

  // Track which dates are visible.
  onVisibleIndicesChanged = (all, now) => {
    const {
      data,
      numMonths,
      currentMonth: _currentMonth,
    } = this.state;

    const {
      updateMonthYear,
      onMonthChange,
    } = this.props;

    // "now" contains the inflight indices, whereas "all" reflects indices
    // after scrolling has settled. Prioritize "now" for faster header updates.
    const currentIndex = now[0] || all[0];
    const currentMonth = data[currentIndex]; // a Moment date

    // Fire month/year update on month changes.  This is
    // necessary for the header and onMonthChange updates.
    if (!_currentMonth || !_currentMonth.isSame(currentMonth, 'month')) {
      const currMonth = currentMonth && currentMonth.clone();
      onMonthChange && onMonthChange(currMonth);
    }

    updateMonthYear && updateMonthYear(currentMonth, true);

    if (currentIndex === 0) {
      this.shiftMonthsBackward(currentMonth);
    } else if (currentIndex > numMonths - 3) {
      this.shiftMonthsForward(currentMonth);
    }
    this.setState({
      currentMonth,
      currentIndex,
    });
  }

  onLayout = event => {
    const containerWidth = event.nativeEvent.layout.width;
    this.setState({
      numVisibleItems: Math.floor(containerWidth / this.state.itemWidth),
      ...this.updateLayout(this.props.renderMonthParams.styles),
    });
  }

  rowRenderer = (type, rowMonth, i, extState) => {
    const { updateMonthYear, renderMonth } = this.props;
    const { currentMonth: month, currentYear: year } = updateMonthYear(rowMonth);
    return renderMonth && renderMonth({...extState, month, year});
  }

  render() {
    const {
      data,
      numMonths,
      itemHeight: height,
      itemWidth: width,
      layoutProvider,
      dataProvider,
    } = this.state;
    if (!data || numMonths === 0 || !height) {
      return null;
    }
    return (
      <View style={{ width, height }} onLayout={this.onLayout}>
        <RecyclerListView
          ref={rlv => this.rlv = rlv}
          layoutProvider={layoutProvider}
          dataProvider={dataProvider}
          rowRenderer={this.rowRenderer}
          extendedState={this.props.renderMonthParams}
          initialRenderIndex={this.props.initialRenderIndex}
          onVisibleIndicesChanged={this.onVisibleIndicesChanged}
          isHorizontal={this.props.horizontal}
          scrollViewProps={{
            showsHorizontalScrollIndicator: false,
            snapToInterval: this.props.horizontal ? width : height,
          }}
        />
      </View>
    );
  }
}
