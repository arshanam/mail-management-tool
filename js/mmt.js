//note: replace all error alerts by custom one

/**
 * this will serve as js file for all operations
 * that need js and need to be added to usman's template
 */
 
/**
 * task 1: adding email to db manually
 * csq: ADD EMAIL {<email_id>}
 */
var sendMail = false;
/**
 * function to add email to db
 */
function addEmail()
{
	var email = document.getElementById('addEmailid').value;
	var multiple = document.getElementById('addMultEmail').value;
	if(!email.length && !multiple.length)
	{
		$("#addEmailid").attr("value","");
		$("#addEmailid").attr("placeholder","enter valid email id");
		return;
	}
	if(email.length)
	{
		if( !validateEmail(email) ) 
		{
	$("#addEmailid").attr("value","");
	$("#addEmailid").attr("placeholder","enter valid email id");
	return;
		}
		var csq = "ADD EMAIL {" +email +"}";
	}
	else if(multiple.length)
	{
		var emails = multiple.split(',');
		var i = 0;
		for(i = 0;i < emails.length;i++)
		{
	if(!validateEmail(emails[i]))
	{
		$("#addMultEmail").html("");
		$("#addMultEmail").attr("placeholder","Some of the email were invalid");
		return;
	}
		}
		while(multiple[multiple.length-1] == ',')
		{
	multiple = multiple.substr(0,multiple.length-2);
		}
		var csq = "ADD EMAIL {" +multiple +"}";
	}
	
    var feedback = sendCSQ(csq,"displayTable tbody",4);
	
}

/**
 * function to add a group
 * to mmt
 */
function addGroup()
{
    var grp = document.getElementById('addgrpid').value;
    var desc = document.getElementById('adddesc').value;
    if(grp.length == 0 || grp =="" ||grp == null)
    {
        $("#addgrpid").attr("value","");
        $("#addgrpid").attr("placeholder","enter valid group name");
        return;
    }

    if(desc.indexOf("~&") != -1)
    {
        desc = desc.replace("~&","\~\&");
    }
    var csq = "ADD GROUP {'" +grp +"'~&'" +desc +"'}";
    sendCSQ(csq,"displaytablebody",6);
}

/**
 * function to send the csq to server
 * and retrieve the feedback
 */
function sendCSQ(csq,outputid,cols)
{
    var data;
	$.post("secure/ajaxserver.php",
        {
            csq: csq
        },
        function(result,status){
            if(status=="success")
            {
                /**
                 * not logged in case
                 */
                if(result == -1 || result == "-1") window.location.href = 'login.php?success=false&message=login+first+to+continue';
                else if(result == -2 || result == "-2") alert("You do not have access to do this!");
                else if(result == 13 || result == "13")alert("You do not have access to do this!");
                else
                {
                    /**
                     * manipulate the feedback
                     */
			if(result.length)
			{
				var rows = result.split('^');
				var output = "";
				var i;
				var j;
				for(i = 0;i < rows.length - 1;i++)
				{
					var colData = rows[i].split('~');
					output += "<tr>";
					for(j = 0;j < cols;j++)
					{
						console.log(rows[i]);
						output += "<td>";
						if(j < colData.length - 1)
						{
					output += colData[j];
						}
						else output += " -- ";
						output += "</td>";
					}
					output += "</tr>";
				}
				$("#" +outputid).prepend(output);
			}
                    console.log("FEEDBACK: "+result);
                }
            }
            else
            {
                alert("Unable to connect!");
            }
        });
	
}
/**
 * variable to set that some row was selected by clicking on row
 * by default set to false
 */
var isSelected = false;

/**
 * function to validate email ids
 */
function validateEmail(email)
{
	if(email.indexOf("@") == -1 || email.indexOf(".") == -1) return false;
	if( (email.indexOf("@") + 2 ) > email.lastIndexOf(".") ) return false;
	return true;
}
$(document).ready(function(){
	$("#mailid").click(function(){checkStatus();});
	//$(".selectallcheckbox").toggle(function(){$('.select').click();},function(){$('.select').click();});
});
function checkStatus()
{
	if(document.getElementById('mailid').checked)
	{
		$("#add_group,#remove_grp,#delete_button").removeClass("disabled");
	}
	else $("#add_group,#remove_grp,#delete_button").addClass("disabled");
}
/** 
 * for subscriber page
 * this will contain ajax request as well
 */
 
/**
 * var to store limit value 
 */
var limit = 20;

var pageno = '';
var key = '';
function loaderOn(){$(".pagin_loader").fadeIn();}
function loaderOff(){$(".pagin_loader").fadeOut();}

/**
 * function to search values by key
 */
function searchByKey()
{
	/**
	 * you need to check if any row is selected nd in case it is
	 * you need to tell the admin about it 
	 */
	if(isSelected)
	{
		alert("Unselect rows before moving on");
		return;
	}
	
	key = document.getElementById('subs_search').value;
	if(key.length != 0){$("#subs_key_reset").fadeIn();}
	else {$("#subs_key_reset").fadeOut();}
	pageno = 1;
	var max = $(".pagin_max").attr('pageno');
	loaderOn();
	$.post("secure/ajaxserver.php",
	{
		retrieve: "true",
		object: "mailids",
		limit: limit,
		page: pageno,
		key: key
	},
	function(result,status){
		if(status=="success")
		{
			if(result != "1001:invalid parameters")
			{
				$("#displayTable tbody").html(result);
				$(".pagin_").removeClass("active");
				$(".pagin_[pageno='1']").addClass("active");
				if(max == 1) $(".pagin_next").addClass("disabled");
				else $(".pagin_next").removeClass("disabled");
				$(".pagin_next").attr("pageno",pageno+1);
				$(".pagin_pre").addClass("disabled");
				$(".pagin_pre").attr("pageno","-1");
			}
			loaderOff();
		}
	});
}


$(document).ready(function(){
	$('.pagin').click(function(){
		/**
		 * you need to check if any row is selected nd in case it is
		 * you need to tell the admin about it 
		 */
		if(isSelected)
		{
			alert("Unselect rows before moving on");
			return;
		}
		loaderOn();
		var max = $(".pagin_max").attr('pageno');
		var pageno = $(this).attr('pageno');
		if(pageno <= max)
		{
			$.post("secure/ajaxserver.php",
			{
				retrieve: "true",
				object: "mailids",
				limit: limit,
				page: pageno,
				key: key
			},
			function(result,status){
				if(status=="success")
				{
					if(result != "1001:invalid parameters")
					{
				$("#displayTable tbody").html(result);
				$(".pagin_").removeClass("active");
				$(".pagin_[pageno='" +pageno +"']").addClass("active");
				if(pageno == max) $(".pagin_next").addClass("disabled");
				else $(".pagin_next").removeClass("disabled");
				$(".pagin_next").attr("pageno",pageno+1);
				if(pageno == 1) $(".pagin_pre").addClass("disabled");
				else $(".pagin_pre").removeClass("disabled");
				$(".pagin_pre").attr("pageno",pageno-1);
				
					}
					loaderOff();
				}
			});
		}
	});
});

function addAccounts()
{
	var username = document.getElementById('addAccount');
	if(username.value.length == 0)
	{
		$('#addAccount').css("border","red 1px solid");
		return false;
	}
	var test  = username.value.replace(/[a-zA-Z0-9-_]/g, "");
	if(test.length != 0)
	{
		$('#addAccount').css("border","red 1px solid");
		return false;
	}
	$('#addAccount').css("border","rgba(0, 0, 0, 0.0745098) 1px solid");
	$.post("secure/nocsqajaxserver.php",
	{
		task: "AddAccount",
		username: username.value,
		result: "JSON"
	},
	function(result,status){
		if(result && status == "success" && result != "1003")
		{
			$("#displayTable tbody").prepend(result);
		}
		else alert("Unable to connect");
	});
	console.log('passed');
}
/**
 * for selecting anddeselecting entries in display table
 */
var selectedIds = new Array();
var selectedIdsCount = 0;
var flag = 0;

$(document).ready(function(){
	$(document).on("click","#displayTable tbody tr",function(){
		if($(this).attr("check") == "false")
		{
			/**
			 * selecting
			 */
			$(this).addClass("selected");		
			var id = $(this).attr("id_");
			selectedIds[selectedIdsCount] = id;
			selectedIdsCount++;
			var obj = $(this).children(".selector_icon").children("img");
			obj.attr("title","click to deselect");
			obj.attr("src","img/hector09/ok_.png");
			if(selectedIdsCount == 1)
			{
				$("#add_group,#delete_button").removeClass("disabled");
				isSelected = true;	
			}
			$(this).attr("check","true");
		}
		else if($(this).attr("check") == "true")
		{
			$(this).removeClass("selected");
			$(this).attr("check","false");
			var id = $(this).attr("id_");
			var i;
			var flag = false;
			for(i = 0;i<selectedIdsCount;i++)
			{
				if(flag)
				{
					selectedIds[i-1] = selectedIds[i];
				}
				else if(selectedIds[i] == id)
				{
					flag = true;
				}
			}
			selectedIdsCount--;
			var obj = $(this).children(".selector_icon").children("img");
			obj.attr("title","click to select");
			obj.attr("src","img/hector09/ok.png");
			if(selectedIdsCount == 0){
				$("#add_group,#delete_button").addClass("disabled");
				isSelected = false;
			}
		}
	
	});
});


$(document).ready(function(){
/**
	$("#displayTable tbody tr").toggle(function(){
		$(this).addClass("selected");		
		var id = $(this).attr("id_");
		selectedIds[selectedIdsCount] = id;
		selectedIdsCount++;
		var obj = $(this).children(".selector_icon").children("img");
		obj.attr("title","click to deselect");
		obj.attr("src","img/hector09/ok_.png");
		if(selectedIdsCount == 1)
		{
			$("#add_group,#delete_button").removeClass("disabled");
			isSelected = true;	
		}
		$(this).attr("check","true");
	},function(){
		$(this).removeClass("selected");
		$(this).attr("check","false");
		var id = $(this).attr("id_");
		var i;
		var flag = false;
		for(i = 0;i<selectedIdsCount;i++)
		{
			if(flag)
			{
				selectedIds[i-1] = selectedIds[i];
			}
			else if(selectedIds[i] == id)
			{
				flag = true;
			}
		}
		selectedIdsCount--;
		var obj = $(this).children(".selector_icon").children("img");
		obj.attr("title","click to select");
		obj.attr("src","img/hector09/ok.png");
		if(selectedIdsCount == 0){
			$("#add_group,#delete_button").addClass("disabled");
			isSelected = false;
		}
	});
*/
	$("#checkAll").toggle(function(){
		$("#displayTable tbody tr[check='false']").click();
		$(this).attr("src","img/hector09/ok_.png");
		$(this).attr("title","Unselect All");
	},function(){
		$("#displayTable tbody tr[check='true']").click();
		$(this).attr("src","img/hector09/ok.png");
		$(this).attr("title","Select All");
	});
});
function deleteSelectedIds()
{
	if(!selectedIdsCount)
	{
		alert("Select some rows first");
		return;
	}
	loaderOn();
	var string = "";
	for(var i = 0;i < selectedIdsCount; i++)
	{
		string += selectedIds[i] +"_";
	}
	while(selectedIdsCount != 0)
	{
		$("#displayTable tbody tr[id_=" +selectedIds[0] +"]").click();
	}
	console.log(string);
	$.post("secure/ajaxserver.php",
			{
				retrieve: "true",
				object: "mailids",
				task: "delete",
				ids: string
			},
			function(result,status){
				if(status=="success")
				{
					if(result == "1")
					{
						var i = 0;
						var arr = string.split('_');
						for( i = 0 ; i < arr.length - 1 ; i++ )
						{
							$("#displayTable tbody tr[id_=" +arr[i] +"]").remove();
						}
						loaderOff();
					}
					else
					{
						alert(result);
						loaderOff();
					}
				}
				else
				{
					alert("Unable to connect to Internet");
					loaderOff();
				}
			});
}

/**
 * for group selection
 */
var selectedGroupsIds = new Array();
var selectedGroupsIdsCount = 0;
var Groupsflag = 0;
$(document).ready(function(){
	$(".group_list div").toggle(function(){
		/**
		 * selecting
		 */
		$(this).addClass("selected");		
		var id = $(this).attr("groupid");
		selectedGroupsIds[selectedGroupsIdsCount] = id;
		selectedGroupsIdsCount++;
		if(selectedGroupsIdsCount == 1)
		{
			$("#add_group").removeClass("disabled");
			isSelected = true;	
		}
	},function(){
		$(this).removeClass("selected");
		var id = $(this).attr("groupid");
		var i;
		var Groupsflag = false;
		for(i = 0;i<selectedGroupsIdsCount;i++)
		{
			if(Groupsflag)
			{
				selectedGroupsIds[i-1] = selectedGroupsIds[i];
			}
			else if(selectedGroupsIds[i] == id)
			{
				Groupsflag = true;
			}
		}
		selectedGroupsIdsCount--;
		if(selectedGroupsIdsCount == 0){
			$("#add_group").addClass("disabled");
		}
	});
});
function addtogroupAction()
{
	if(!selectedIdsCount)
	{
		alert("Select some rows first");
		return;
	}
	loaderOn();
	$(".addtogroup").slideDown();
	$("#add_group").html('<i class="icon-plus icon-white"></i> Add To Selected Groups');
	$("#add_group").attr("onclick","javascript: addEmailToGroup()");
	loaderOff();
}
function addEmailToGroup()
{
	loaderOn();
	var csq = "ADD EMAIL {";
	var i = 0;
	for( i = 0; i<selectedIdsCount; i++)
	{
		csq += selectedIds[i];
		if(i != (selectedIdsCount-1)) csq += ",";
	}
	csq += "} TO GROUP {";
	for( i = 0; i<selectedGroupsIdsCount; i++)
	{
		csq += selectedGroupsIds[i];
		if(i != (selectedGroupsIdsCount-1)) csq += ",";
	}
	csq += "}";
	$.post("secure/ajaxserver.php",
    {
        csq: csq
    },
    function(result,status)
	{
       if(status=="success")
        {
			if(result == "1")
			{
				showSuccessMesg("Sucessfully added to groups");
				loaderOff();
				$(".group_list div.selected").removeClass("selected");
				selectedGroupsIdsCount = 0;
				$("#add_group").addClass("disabled");
			}
			else
			{
				showErrorMesg("ERROR: " +result);
				loaderOff();
			}
		}
		else
		{
			showErrorMesg("Unable to connect to internet");
			loaderOff();
		}
	});
}
var tsucess;
var terror;
function showSuccessMesg(mesg)
{
	clearTimeout(tsucess);
	$("#noty_section:visible").fadeOut();
	$("#noty_section").removeClass("noty_error");
	$("#noty_section").addClass("noty_success");
	$("#noty_section div span").html(mesg);
	$("#noty_section").fadeIn();
	tsucess = setTimeout("hidenotif()",2000);
}
function showErrorMesg(mesg)
{
	clearTimeout(terror);
	$("#noty_section:visible").fadeOut();
	$("#noty_section").removeClass("noty_success");
	$("#noty_section").addClass("noty_error");
	$("#noty_section div span").html(mesg);
	$("#noty_section").fadeIn();
	terror = setTimeout("hidenotif()",2000);
}
function hidenotif()
{
	$("#noty_section:visible").fadeOut();
	$("#noty_section div span").html("");
}