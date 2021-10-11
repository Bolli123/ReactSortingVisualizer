import './List.css';
import Toolbar from './Toolbar';
import React from 'react';
import ListElement from './ListElement';

var LIST_LEN = 100

class List extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			list: [],
			shuffledList: [],
			selected: [],
			frames: [],
			listLength: LIST_LEN,
			currentframeIndex: 0,
			swapped: [],
			sortedValues: [],
			sorted: false,
			playing: false,
			sortedValueIndex: 0,
			sortingAlgorithm: 'selectionSort',
			infoBoxX: 0,
			infoBoxY: 0,
			infoBoxValue: 0,
			infoBoxVisible: false,
			sortingSpeed: 50
		}
	}
	componentWillUnmount() {
		clearInterval(this.interval);
	}
	componentDidMount() {
		let list = this.getList(LIST_LEN)
		this.setState({
			list: list,
			shuffledList: list.slice(),
		})
	}
	createInterval() {
		const { sortingSpeed } = this.state
		if (!this.interval) {
			this.interval = setInterval(() => this.handleframes(), sortingSpeed);
		}
		else {
			this.removeInterval()
		}
	}
	removeInterval() {
		clearInterval(this.interval);
		this.interval = null
	}

	getList(size) {
			var list = []
			for (var i = 0; i < size; i++) {
				//Generates random interger between 9 and LIST_LEN
				let randInt = Math.floor(Math.random() * (LIST_LEN - 9) + 9)
				list.push(randInt)
			}
			let sList = this.shuffle(list)
			this.setState({
				shuffledList: sList.slice()
			})
			return sList
	}
	//TODO: source/rewrite
	shuffle(list) {
		let currentIndex = list.length, randomIndex
	
		// While there remain elements to shuffle...
		while (currentIndex != 0) {
	
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex)
			currentIndex--
	
			// And swap it with the current element.
			[list[currentIndex], list[randomIndex]] = [
				list[randomIndex], list[currentIndex]]
		}
		return list
	}
	insertionSort(list) {
		var frames = []
		for (var i = 0; i < list.length; i++) {
			for (var j = i; j >= 0; j--) {
				frames.push({focused: [j]})
				if (list[j] < list[j - 1]) {
					[list[j - 1], list[j]] = [list[j], list[j - 1]]
					frames.push({swap: [j-1, j]})
				}
				else {
					break
				}
			}
		}
		this.setState({
			frames: frames,
		})
		return list
	}
	selectionSort(list) {
		var frames = []
		for (var i = 0; i < list.length - 1; i++) {
			var smallest_index = i
			for (var j = i; j < list.length; j++) {
				if (list[j] < list[smallest_index]) {
					smallest_index = j
				}
				frames.push({focused: [j, smallest_index]})
			}
			[list[smallest_index], list[i]] = [list[i], list[smallest_index]]
			frames.push({swap: [smallest_index, i]})
		}
		this.setState({
			frames: frames,
		})
		return list
	}
	bubbleSort(list) {
		var frames = []
		for (var i = 0; i < list.length - 1; i++) {
			for (var j = 0; j < list.length - 1 - i; j++) {
				frames.push({focused: [j]})
				if (list[j] > list[j + 1]) {
					[list[j], list[j + 1]] = [list[j + 1], list[j]]
					frames.push({swap: [j+1, j]})
				}
			}
		}
		this.setState({
			frames: frames,
		})
		return list
	}
	quickSort(list) {
		var frames = []
		this.quickSortHelper(list, 0, list.length-1, frames)
		this.setState({
			frames: frames,
		})
		return list
	}
	quickSortHelper(list, low, high, frames) {
		var pivot;
		if (low < high) {
			pivot = this.findPivot(list, low, high, frames)
			this.quickSortHelper(list, low, pivot-1, frames)
			this.quickSortHelper(list, pivot+1, high, frames)
		}
		return list
	}
	findPivot(list, low, high, frames) {
		var pivot = list[high]
		var swapPos = low-1
		for (var i = low; i <= high - 1; i++) {
			frames.push({focused: [i, pivot]})
			if (list[i] < pivot) {
				swapPos++
				[list[i], list[swapPos]] = [list[swapPos], list[i]]
				frames.push({focusSwap: [[i, swapPos], [pivot]]})
			}
		}
		[list[swapPos+1], list[high]] = [list[high], list[swapPos+1]]
		frames.push({swap: [high, swapPos+1]}) 
		return swapPos+1
	}
	merge(list, low, middle, high, frames) {
		const lSize = middle - low + 1
		const rSize = high - middle
		var frameIndexes = [[], []]
		var leftList = []
		var rightList = []
		for (var i = 0; i < lSize; i++) {
			frameIndexes[0].push(low + i)
			leftList.push(list[low + i])
		}
		for (var i = 0; i < rSize; i++) {
			frameIndexes[1].push(middle + i + 1)
			rightList.push(list[middle + i + 1])
		}
		var lCount = 0
		var rCount = 0
		var index = low
		while (lCount < lSize && rCount < rSize) {
			frames.push({focused: [frameIndexes[0][lCount], frameIndexes[1][rCount]]})
			if (leftList[lCount] < rightList[rCount]) {
				frames.push({setIndex: [index, leftList[lCount]]}) 
				list[index] = leftList[lCount]
				lCount++
			}
			else {
				frames.push({setIndex: [index, rightList[rCount]]}) 
				list[index] = rightList[rCount]
				rCount++
			}
			index++
		}
		for (var i = lCount; i < lSize; i++) {
			frames.push({setIndex: [index, leftList[i]]}) 
			list[index] = leftList[i]
			index++
		}
		for (var i = rCount; i < rSize; i++) {
			frames.push({setIndex: [index, rightList[i]]})  
			list[index] = rightList[i]
			index++
		}
	}
	mergeSort(list) {
		var frames = []
		this.mergeSortHelper(list, 0, list.length-1, frames)
		this.setState({
			frames: frames,
		})
		return list
	}
	mergeSortHelper(list, low, high, frames) {
		if (low < high) {
			var middle = Math.floor(low + (high-low) / 2)
			this.mergeSortHelper(list, low, middle, frames)
			this.mergeSortHelper(list, middle+1, high, frames)
			this.merge(list, low, middle, high, frames)
		}	
	}

	restartSort() {
		const { shuffledList } = this.state
		this.removeInterval()
		this.setState({
			list: shuffledList.slice(),
			selected: [],
			currentframeIndex: 0,
			swapped: [],
			sortedValues: [],
			sorted: false,
			playing: false,
			sortedValueIndex: 0,
		})
	}
	handleSortChange(list) {
		const { sortingAlgorithm } = this.state
		//lol
		return this[sortingAlgorithm](list)
	}
	handleframes(forwards = true) {
		var { list, frames, currentframeIndex, selected, swapped, sorted, sortedValues, sortedValueIndex } = this.state
		if (currentframeIndex >= frames.length-1 && forwards) {
			sorted = true
			this.setState({
				sorted: sorted,
				selected: [],
				swapped: [],
				playing: false,
				sortingSpeed: 1,
			})
		}
		if (sorted) {
			if (sortedValueIndex >= LIST_LEN) {
				this.removeInterval()
				return
			}
			sortedValues.push(sortedValueIndex)
			sortedValueIndex = sortedValueIndex+1
			this.setState({
				sortedValues: sortedValues,
				sortedValueIndex: sortedValueIndex
			})
			return
		}
		selected = []
		// if currentFrame is 0, move forwards, else check if forwards is true and move forwards or backwards respectively
		currentframeIndex = currentframeIndex + (currentframeIndex === 0 ? 1 : (forwards ? 1 : -1))
		var currentframe = frames[currentframeIndex]
		// Seek
		if (currentframe["focused"] != undefined) {
			for (const item of currentframe["focused"]) {
				selected.push(item)
			}
		}
		// Swap
		else if (currentframe["swap"] != undefined) {
			swapped = []
			for (const item of currentframe["swap"]) {
				swapped.push(item)
			}
			[list[currentframe["swap"][0]], list[currentframe["swap"][1]]] = [list[currentframe["swap"][1]], list[currentframe["swap"][0]]]
		}
		// Used when focus
		// TODO: fix shit code
		else if (currentframe["focusSwap"] != undefined) {
			swapped = []
			for (const item of currentframe["focusSwap"][0]) {
				swapped.push(item)
			}
			for (const item of currentframe["focusSwap"][1]) {
				selected.push(item)
			}
			[list[currentframe["focusSwap"][0][0]], list[currentframe["focusSwap"][0][1]]] = [list[currentframe["focusSwap"][0][1]], list[currentframe["focusSwap"][0][0]]]
		}
		else if (currentframe["setIndex"] != undefined) {
			swapped = []
			for (const item of currentframe["setIndex"]) {
				swapped.push(item)
			}
			list[currentframe["setIndex"][0]] = currentframe["setIndex"][1]
		}
		this.setState({
			currentframeIndex: currentframeIndex,
			selected: selected,
			swapped: swapped
		})
	}
	async handleClick(e, type) {
		e.preventDefault()
		const { list, playing, currentframeIndex, sorted } = this.state
		var listCpy = list.slice()
		if (type == "play") {
			if (sorted) {
				return
			}
			if (currentframeIndex == 0) {
				this.handleSortChange(listCpy)
			}
			this.createInterval()
			this.setState({
				playing: !playing
			})
		}
		else if (type == "reset") {
			this.restartSort()
		}
		else if (type == "finish") {
			this.setState({
				list: this.handleSortChange(listCpy),
				currentframeIndex: LIST_LEN-1,
				selected: [],
				sorted: true,
				playing: true
			})
			this.createInterval()
		}
		else if (type == "frameForward") {
			if (currentframeIndex == 0) {
				await this.handleSortChange(listCpy)
			}
			this.handleframes()
		}
		else if (type == "frameBack") {
			if (currentframeIndex == 0) {
				this.setState({
					selected: [],
					swapped: []
				})
				return
			}
			if (sorted) {
				this.setState({
					sorted: false,
					sortedValues: [],
					sortedValueIndex: 0
				})
			}

			this.handleframes(false)
		}
	}
	handleAlgorithmChange(selected) {
		var selectedValue = selected["value"] + "Sort"
		this.setState({
			sortingAlgorithm: selectedValue
		})
		this.restartSort()
		const { shuffledList } = this.state
		var listCpy = shuffledList.slice()
		this.handleSortChange(listCpy)
	}
	infoBoxHover(x, y, listValue) {
		this.setState({
			infoBoxX: x,
			infoBoxY: y,
			infoBoxValue: listValue,
			infoBoxVisible: true
		})
	}
	infoBoxHide() {
		this.setState({
			infoBoxVisible: false
		})
	}
	handleSpeedChange(newSpeed) {
		const { playing } = this.state
		console.log(newSpeed)
		this.setState({
			sortingSpeed: newSpeed
		})
		if (playing) {
			this.removeInterval()
			this.createInterval()
		}
	}
	render() {
		const { 
			list, 
			selected, 
			swapped, 
			sortedValues, 
			playing, 
			infoBoxValue, 
			infoBoxX,
			infoBoxY, 
			infoBoxVisible, 
		} = this.state
		var infoBoxCSS = {
			visibility: infoBoxVisible ? 'visible' : 'hidden',
			top: infoBoxY - 5 + 'vh',
			left: infoBoxX - .5 +'vw'
		}
		return (
			<div className="Wrapper">
				<div ref={e => (this.toolbar = e)}>
					<Toolbar 
						clicked={(e, type) => this.handleClick(e, type)} 
						playing={playing} 
						handleAlgorithmChange={(e) => this.handleAlgorithmChange(e)}
						handleSpeedChange={(newSpeed) => this.handleSpeedChange(newSpeed)}
					/>
				</div>
				<div className="List" align="center">
					{
						list.map((m, index) => 
							<ListElement 
								key={index} 
								length={m} 
								selected={selected.includes(index)} 
								swapped={swapped.includes(index)} 
								sorted={sortedValues.includes(index)} 
								infoBoxHover={(x, y, listValue) => this.infoBoxHover(x, y, listValue)}
								infoBoxHide={() => this.infoBoxHide()}
							/>)
					}
				</div>
				<div className="Info-Box-Text" style={infoBoxCSS}>
                    {infoBoxValue}
                </div>
			</div>
		);
		}
	}
export default List;
