// Generated from WHLSL/Spec/WHLSL.g4 by ANTLR 4.7.2
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete listener for a parse tree produced by WHLSLParser.
function WHLSLListener() {
	antlr4.tree.ParseTreeListener.call(this);
	return this;
}

WHLSLListener.prototype = Object.create(antlr4.tree.ParseTreeListener.prototype);
WHLSLListener.prototype.constructor = WHLSLListener;

// Enter a parse tree produced by WHLSLParser#file.
WHLSLListener.prototype.enterFile = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#file.
WHLSLListener.prototype.exitFile = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#topLevelDecl.
WHLSLListener.prototype.enterTopLevelDecl = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#topLevelDecl.
WHLSLListener.prototype.exitTopLevelDecl = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#semantic.
WHLSLListener.prototype.enterSemantic = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#semantic.
WHLSLListener.prototype.exitSemantic = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#builtInSemantic.
WHLSLListener.prototype.enterBuiltInSemantic = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#builtInSemantic.
WHLSLListener.prototype.exitBuiltInSemantic = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#stageInOutSemantic.
WHLSLListener.prototype.enterStageInOutSemantic = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#stageInOutSemantic.
WHLSLListener.prototype.exitStageInOutSemantic = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#resourceSemantic.
WHLSLListener.prototype.enterResourceSemantic = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#resourceSemantic.
WHLSLListener.prototype.exitResourceSemantic = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#specializationConstantSemantic.
WHLSLListener.prototype.enterSpecializationConstantSemantic = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#specializationConstantSemantic.
WHLSLListener.prototype.exitSpecializationConstantSemantic = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#typeDef.
WHLSLListener.prototype.enterTypeDef = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#typeDef.
WHLSLListener.prototype.exitTypeDef = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#structDef.
WHLSLListener.prototype.enterStructDef = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#structDef.
WHLSLListener.prototype.exitStructDef = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#structElement.
WHLSLListener.prototype.enterStructElement = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#structElement.
WHLSLListener.prototype.exitStructElement = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#enumDef.
WHLSLListener.prototype.enterEnumDef = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#enumDef.
WHLSLListener.prototype.exitEnumDef = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#enumMember.
WHLSLListener.prototype.enterEnumMember = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#enumMember.
WHLSLListener.prototype.exitEnumMember = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#numthreadsSemantic.
WHLSLListener.prototype.enterNumthreadsSemantic = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#numthreadsSemantic.
WHLSLListener.prototype.exitNumthreadsSemantic = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#funcDef.
WHLSLListener.prototype.enterFuncDef = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#funcDef.
WHLSLListener.prototype.exitFuncDef = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#funcDecl.
WHLSLListener.prototype.enterFuncDecl = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#funcDecl.
WHLSLListener.prototype.exitFuncDecl = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#parameters.
WHLSLListener.prototype.enterParameters = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#parameters.
WHLSLListener.prototype.exitParameters = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#parameter.
WHLSLListener.prototype.enterParameter = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#parameter.
WHLSLListener.prototype.exitParameter = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#type.
WHLSLListener.prototype.enterType = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#type.
WHLSLListener.prototype.exitType = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#addressSpace.
WHLSLListener.prototype.enterAddressSpace = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#addressSpace.
WHLSLListener.prototype.exitAddressSpace = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#typeSuffixAbbreviated.
WHLSLListener.prototype.enterTypeSuffixAbbreviated = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#typeSuffixAbbreviated.
WHLSLListener.prototype.exitTypeSuffixAbbreviated = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#typeSuffixNonAbbreviated.
WHLSLListener.prototype.enterTypeSuffixNonAbbreviated = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#typeSuffixNonAbbreviated.
WHLSLListener.prototype.exitTypeSuffixNonAbbreviated = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#typeArguments.
WHLSLListener.prototype.enterTypeArguments = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#typeArguments.
WHLSLListener.prototype.exitTypeArguments = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#typeArgument.
WHLSLListener.prototype.enterTypeArgument = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#typeArgument.
WHLSLListener.prototype.exitTypeArgument = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#block.
WHLSLListener.prototype.enterBlock = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#block.
WHLSLListener.prototype.exitBlock = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#blockBody.
WHLSLListener.prototype.enterBlockBody = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#blockBody.
WHLSLListener.prototype.exitBlockBody = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#stmt.
WHLSLListener.prototype.enterStmt = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#stmt.
WHLSLListener.prototype.exitStmt = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#ifStmt.
WHLSLListener.prototype.enterIfStmt = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#ifStmt.
WHLSLListener.prototype.exitIfStmt = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#switchStmt.
WHLSLListener.prototype.enterSwitchStmt = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#switchStmt.
WHLSLListener.prototype.exitSwitchStmt = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#switchCase.
WHLSLListener.prototype.enterSwitchCase = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#switchCase.
WHLSLListener.prototype.exitSwitchCase = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#forStmt.
WHLSLListener.prototype.enterForStmt = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#forStmt.
WHLSLListener.prototype.exitForStmt = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#whileStmt.
WHLSLListener.prototype.enterWhileStmt = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#whileStmt.
WHLSLListener.prototype.exitWhileStmt = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#doStmt.
WHLSLListener.prototype.enterDoStmt = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#doStmt.
WHLSLListener.prototype.exitDoStmt = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#variableDecls.
WHLSLListener.prototype.enterVariableDecls = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#variableDecls.
WHLSLListener.prototype.exitVariableDecls = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#variableDecl.
WHLSLListener.prototype.enterVariableDecl = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#variableDecl.
WHLSLListener.prototype.exitVariableDecl = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#constexpression.
WHLSLListener.prototype.enterConstexpression = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#constexpression.
WHLSLListener.prototype.exitConstexpression = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#effectfulExpr.
WHLSLListener.prototype.enterEffectfulExpr = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#effectfulExpr.
WHLSLListener.prototype.exitEffectfulExpr = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#effAssignment.
WHLSLListener.prototype.enterEffAssignment = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#effAssignment.
WHLSLListener.prototype.exitEffAssignment = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#assignOperator.
WHLSLListener.prototype.enterAssignOperator = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#assignOperator.
WHLSLListener.prototype.exitAssignOperator = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#effPrefix.
WHLSLListener.prototype.enterEffPrefix = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#effPrefix.
WHLSLListener.prototype.exitEffPrefix = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#effSuffix.
WHLSLListener.prototype.enterEffSuffix = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#effSuffix.
WHLSLListener.prototype.exitEffSuffix = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#expr.
WHLSLListener.prototype.enterExpr = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#expr.
WHLSLListener.prototype.exitExpr = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#possibleTernaryConditional.
WHLSLListener.prototype.enterPossibleTernaryConditional = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#possibleTernaryConditional.
WHLSLListener.prototype.exitPossibleTernaryConditional = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#possibleLogicalBinop.
WHLSLListener.prototype.enterPossibleLogicalBinop = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#possibleLogicalBinop.
WHLSLListener.prototype.exitPossibleLogicalBinop = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#logicalBinop.
WHLSLListener.prototype.enterLogicalBinop = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#logicalBinop.
WHLSLListener.prototype.exitLogicalBinop = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#possibleRelationalBinop.
WHLSLListener.prototype.enterPossibleRelationalBinop = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#possibleRelationalBinop.
WHLSLListener.prototype.exitPossibleRelationalBinop = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#relationalBinop.
WHLSLListener.prototype.enterRelationalBinop = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#relationalBinop.
WHLSLListener.prototype.exitRelationalBinop = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#possibleShift.
WHLSLListener.prototype.enterPossibleShift = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#possibleShift.
WHLSLListener.prototype.exitPossibleShift = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#possibleAdd.
WHLSLListener.prototype.enterPossibleAdd = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#possibleAdd.
WHLSLListener.prototype.exitPossibleAdd = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#possibleMult.
WHLSLListener.prototype.enterPossibleMult = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#possibleMult.
WHLSLListener.prototype.exitPossibleMult = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#possiblePrefix.
WHLSLListener.prototype.enterPossiblePrefix = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#possiblePrefix.
WHLSLListener.prototype.exitPossiblePrefix = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#prefixOp.
WHLSLListener.prototype.enterPrefixOp = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#prefixOp.
WHLSLListener.prototype.exitPrefixOp = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#limitedSuffixOperator.
WHLSLListener.prototype.enterLimitedSuffixOperator = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#limitedSuffixOperator.
WHLSLListener.prototype.exitLimitedSuffixOperator = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#possibleSuffix.
WHLSLListener.prototype.enterPossibleSuffix = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#possibleSuffix.
WHLSLListener.prototype.exitPossibleSuffix = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#callExpression.
WHLSLListener.prototype.enterCallExpression = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#callExpression.
WHLSLListener.prototype.exitCallExpression = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#term.
WHLSLListener.prototype.enterTerm = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#term.
WHLSLListener.prototype.exitTerm = function(ctx) {
};


// Enter a parse tree produced by WHLSLParser#literal.
WHLSLListener.prototype.enterLiteral = function(ctx) {
};

// Exit a parse tree produced by WHLSLParser#literal.
WHLSLListener.prototype.exitLiteral = function(ctx) {
};



exports.WHLSLListener = WHLSLListener;